import React from "react"
import styled from "@emotion/styled"
import configureCadence, {CADENCE_LANGUAGE_ID} from "../util/cadence"
import {CadenceCheckCompleted, CadenceLanguageServer, Callbacks} from "../util/language-server"
import {createCadenceLanguageClient} from "../util/language-client"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import {EntityType} from "providers/Project";
import Arguments from "components/Arguments";
import { Argument } from "components/Arguments/types";
import {
  MonacoLanguageClient,
  ExecuteCommandRequest,
} from "monaco-languageclient"

const {MonacoServices} = require("monaco-languageclient/lib/monaco-services");

type EditorState = {
  model: any;
  viewState: any;
};

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  .drag-box{
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 30px;
    top: 0;
    z-index: 12;
  }
  
  .constraints{
    width: 90vw;
    height: 90vh;
    position: fixed;
    left: 2vw;
    top: 2vw;
    pointer-events: none;
  }
`;

let monacoServicesInstalled = false;

type CodeGetter = (index: number) => string | undefined

class CadenceEditor extends React.Component<{
  code: string;
  mount: string;
  onChange: any;
  activeId: string;
  type: EntityType;
  getCode: CodeGetter;
}> {
  editor: monaco.editor.ICodeEditor;
  _subscription: any;
  editorStates: { [key: string]: EditorState };
  private callbacks: Callbacks;

  constructor(props: {
    code: string;
    mount: string;
    onChange: any;
    activeId: string;
    type: EntityType;
    getCode: CodeGetter;
  }) {
    super(props);

    this.editorStates = {};

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);

    configureCadence();
  }

  handleResize() {
    this.editor && this.editor.layout();
  }

  async componentDidMount() {
    const editor = monaco.editor.create(
      document.getElementById(this.props.mount),
      {
        theme: 'vs-light',
        language: CADENCE_LANGUAGE_ID,
        minimap: {
          enabled: false
        }
      }
    );
    this.editor = editor

    this._subscription = this.editor.onDidChangeModelContent((event: any) => {
      this.props.onChange(this.editor.getValue(), event);
    });

    const state = this.getOrCreateEditorState(
      this.props.activeId,
      this.props.code
    );
    this.editor.setModel(state.model);
    this.editor.focus();

    if (this.props.activeId && !this.callbacks) {
      await this.loadLanguageServer(editor, (index) => this.props.getCode(index))
    }
  }

  private async loadLanguageServer(editor: monaco.editor.ICodeEditor, getCode: CodeGetter) {

    this.callbacks = {
      // The actual callback will be set as soon as the language server is initialized
      toServer: null,

      // The actual callback will be set as soon as the language server is initialized
      onClientClose: null,

      // The actual callback will be set as soon as the language client is initialized
      onServerClose: null,

      // The actual callback will be set as soon as the language client is initialized
      toClient: null,

      getAddressCode(address: string): string | undefined {
        const number = parseInt(address, 16)
        if (!number) {
          return
        }
        return getCode(number - 1)
      },
    }

    // The Monaco Language Client services have to be installed globally, once.
    // An editor must be passed, which is only used for commands.
    // As the Cadence language server is not providing any commands this is OK

    if (!monacoServicesInstalled) {
      monacoServicesInstalled = true
      MonacoServices.install(editor);
    }

    // Start one language server per editor.
    // Even though one language server can handle multiple documents,
    // this demonstrates this is possible and is more resilient:
    // if the server for one editor crashes, it does not break the other editors

    await CadenceLanguageServer.create(this.callbacks);

    this.languageClient = createCadenceLanguageClient(this.callbacks);
    this.languageClient.start()
    this.languageClient.onReady().then(() => {
      this.languageClient.onNotification(CadenceCheckCompleted.methodName, (result: CadenceCheckCompleted.Params) => {
        if (!result.valid) {
          return
        }
        this.getParameters()
      })
    })
  }

  getOrCreateEditorState(id: string, code: string): EditorState {
    const existingState = this.editorStates[id];

    if (existingState !== undefined) {
      return existingState;
    }

    const monaco = require("monaco-editor");
    const model = monaco.editor.createModel(code, CADENCE_LANGUAGE_ID);

    const state: EditorState = {
      model,
      viewState: null
    };

    this.editorStates[id] = state;

    return state;
  }

  saveEditorState(id: string, viewState: any) {
    this.editorStates[id].viewState = viewState;
  }

  switchEditor(prevId: string, newId: string) {
    const newState = this.getOrCreateEditorState(newId, this.props.code);

    const currentViewState = this.editor.saveViewState();

    this.saveEditorState(prevId, currentViewState);

    this.editor.setModel(newState.model);
    this.editor.restoreViewState(newState.viewState);
    this.editor.focus();
  }

  componentWillUnmount() {
    this.destroyMonaco();
    window.removeEventListener("resize", this.handleResize);
    if (this.callbacks && this.callbacks.onClientClose) {
      this.callbacks.onClientClose()
    }
  }

  async componentDidUpdate(prevProps: any) {
    if (this.props.activeId !== prevProps.activeId) {
      this.switchEditor(prevProps.activeId, this.props.activeId);
      this.destroyMonaco();
      await this.componentDidMount();
    }
  }

  destroyMonaco() {
    if (this.editor) {
      this.editor.dispose();
      const model = this.editor.getModel();
      if (model) {
        model.dispose();
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  extract(code: string, keyWord: string):string[]{
    // TODO: add different processors for contract, scripts and transactions

    const target = code
      .split(/\r\n|\n|\r/)
      .find(line => line.includes(keyWord))

    if (target){
      const match = target.match(/(?:\()(.*)(?:\))/)
      if (match){
        return match[1]
          .split(",")
          .map(item => item.replace(/\s*/g,''))
      }
    }
    return []
  }

  extractTransactionArguments(code: string):Argument[]{
    return this
      .extract(code, "transaction")
      .map(item => item.split(":"))
      .map(item =>{
      const [name, type] = item
      return {
        name,
        type
      }
    });
  }

  extractScriptArguments(code:string):Argument[]{
    return this
      .extract(code, "fun main")
      .map(item =>{
        const [name, type] = item
        return {
          name,
          type
        }
      });
  }

  extractSigners(code: string):number{
    return this
      .extract(code, "prepare")
      .filter(item => !!item)
      .length
  }

  render() {
    const { type, code } = this.props;
    const list = type === EntityType.TransactionTemplate
        ? this.extractTransactionArguments(code)
        : this.extractScriptArguments(code)
    const signers = this.extractSigners(code);

    return (
      <EditorContainer id={this.props.mount}>
        <Arguments type={type} list={list} signers={signers}/>
      </EditorContainer>
    );
  }
}

export default CadenceEditor;
