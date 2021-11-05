import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';
import {
  CadenceCheckCompleted,
  CadenceLanguageServer,
  Callbacks,
} from 'util/language-server';
import { createCadenceLanguageClient } from 'util/language-client';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { EntityType } from 'providers/Project';
import Arguments from 'components/Arguments';
import { Argument } from 'components/Arguments/types';
import {
  CadenceProblem,
  formatMarker,
  goTo,
  Highlight,
  ProblemsList,
} from 'util/language-syntax-errors';
import {
  MonacoLanguageClient,
  ExecuteCommandRequest,
} from 'monaco-languageclient';

const { MonacoServices } = require('monaco-languageclient/lib/monaco-services');

const blink = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .drag-box {
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 30px;
    top: 0;
    z-index: 12;
  }

  .constraints {
    width: 96vw;
    height: 90vh;
    position: fixed;
    left: 2vw;
    right: 2vw;
    top: 2vw;
    bottom: 2vw;
    pointer-events: none;
  }

  .playground-syntax-error-hover {
    background-color: rgba(238, 67, 30, 0.1);
  }

  .playground-syntax-error-hover-selection {
    background-color: rgba(238, 67, 30, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-warning-hover {
    background-color: rgb(238, 169, 30, 0.1);
  }

  .playground-syntax-warning-hover-selection {
    background-color: rgb(238, 169, 30, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-info-hover {
    background-color: rgb(85, 238, 30, 0.1);
  }

  .playground-syntax-info-hover-selection {
    background-color: rgb(85, 238, 30, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-hint-hover,
  .playground-syntax-unknown-hover {
    background-color: rgb(160, 160, 160, 0.1);
  }

  .playground-syntax-hint-hover-selection,
  .playground-syntax-unknown-hover-selection {
    background-color: rgb(160, 160, 160, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }
`;

type EditorState = {
  model: any;
  viewState: any;
};

let monacoServicesInstalled = false;

type CodeGetter = (index: number) => string | undefined;

type CadenceEditorProps = {
  code: string;
  mount: string;
  onChange: any;
  activeId: string;
  type: EntityType;
  getCode: CodeGetter;
};

type CadenceEditorState = {
  args: { [key: string]: Argument[] };
  problems: { [key: string]: ProblemsList };
};

class CadenceEditor extends React.Component<
  CadenceEditorProps,
  CadenceEditorState
> {
  editor: monaco.editor.ICodeEditor;
  languageClient?: MonacoLanguageClient;
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
    window.addEventListener('resize', this.handleResize);
    configureCadence();

    this.state = {
      args: {},
      problems: {},
    };
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
          enabled: false,
        },
      },
    );
    this.editor = editor;

    this._subscription = this.editor.onDidChangeModelContent((event: any) => {
      this.props.onChange(this.editor.getValue(), event);
    });

    const state = this.getOrCreateEditorState(
      this.props.activeId,
      this.props.code,
    );
    this.editor.setModel(state.model);
    this.editor.focus();

    if (this.props.activeId && !this.callbacks) {
      const getCode = (index: number) =>
        this.props.getCode(index)
      await this.loadLanguageServer(getCode);
    }
  }

  private async loadLanguageServer(
    getCode: CodeGetter,
  ) {
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
        const number = parseInt(address, 16);
        if (!number) {
          return;
        }
        return getCode(number - 1);
      },
    };

    // The Monaco Language Client services have to be installed globally, once.
    // An editor must be passed, which is only used for commands.
    // As the Cadence language server is not providing any commands this is OK

    if (!monacoServicesInstalled) {
      monacoServicesInstalled = true;
      MonacoServices.install(monaco);
    }

    // Start one language server per editor.
    // Even though one language server can handle multiple documents,
    // this demonstrates this is possible and is more resilient:
    // if the server for one editor crashes, it does not break the other editors

    await CadenceLanguageServer.create(this.callbacks);

    this.languageClient = createCadenceLanguageClient(this.callbacks);
    this.languageClient.start();
    this.languageClient.onReady().then(() => {
      this.languageClient.onNotification(
        CadenceCheckCompleted.methodName,
        async (result: CadenceCheckCompleted.Params) => {
          if (result.valid) {
            const params = await this.getParameters();
            this.setExecutionArguments(params);
          }
          this.processMarkers();
        },
      );
    });
  }

  private async getParameters() {
    await this.languageClient.onReady();

    try {
      const args = await this.languageClient.sendRequest(
        ExecuteCommandRequest.type,
        {
          command: 'cadence.server.getEntryPointParameters',
          arguments: [this.editor.getModel().uri.toString()],
        },
      );
      return args || [];
    } catch (error) {
      console.error(error);
    }
  }

  processMarkers() {
    const model = this.editor.getModel();
    const modelMarkers = monaco.editor.getModelMarkers({ resource: model.uri });
    const errors = modelMarkers.reduce(
      (acc: { [key: string]: CadenceProblem[] }, marker) => {
        const mappedMarker: CadenceProblem = formatMarker(marker);
        acc[mappedMarker.type].push(mappedMarker);
        return acc;
      },
      {
        error: [],
        warning: [],
        info: [],
        hint: [],
      },
    );

    const { activeId } = this.props;

    this.setState({
      problems: {
        [activeId]: errors,
      },
    });
  }

  setExecutionArguments(args: Argument[]) {
    const { activeId } = this.props;
    this.setState({
      args: {
        [activeId]: args,
      },
    });
  }

  getOrCreateEditorState(id: string, code: string): EditorState {
    const existingState = this.editorStates[id];

    if (existingState !== undefined) {
      return existingState;
    }

    const model = monaco.editor.createModel(code, CADENCE_LANGUAGE_ID);

    const state: EditorState = {
      model,
      viewState: null,
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
    window.removeEventListener('resize', this.handleResize);
    if (this.callbacks && this.callbacks.onClientClose) {
      this.callbacks.onClientClose();
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

  extract(code: string, keyWord: string): string[] {
    // TODO: add different processors for contract, scripts and transactions

    const target = code
      .split(/\r\n|\n|\r/)
      .find((line) => line.includes(keyWord));

    if (target) {
      const match = target.match(/(?:\()(.*)(?:\))/);
      if (match) {
        return match[1].split(',').map((item) => item.replace(/\s*/g, ''));
      }
    }
    return [];
  }

  extractSigners(code: string): number {
    return this.extract(code, 'prepare').filter((item) => !!item).length;
  }

  hover(highlight: Highlight): void {
    const { startLine, startColumn, endLine, endColumn, color } = highlight;
    const model = this.editor.getModel();

    const selection = model.getAllDecorations().find((item: any) => {
      return (
        item.range.startLineNumber === startLine &&
        item.range.startColumn === startColumn
      );
    });

    const selectionEndLine = selection
      ? selection.range.endLineNumber
      : endLine;
    const selectionEndColumn = selection
      ? selection.range.endColumn
      : endColumn;

    const highlightLine = [
      {
        range: new monaco.Range(startLine, startColumn, endLine, endColumn),
        options: {
          isWholeLine: true,
          className: `playground-syntax-${color}-hover`,
        },
      },
      {
        range: new monaco.Range(
          startLine,
          startColumn,
          selectionEndLine,
          selectionEndColumn,
        ),
        options: {
          isWholeLine: false,
          className: `playground-syntax-${color}-hover-selection`,
        },
      },
    ];
    this.editor.getModel().deltaDecorations([], highlightLine);
    this.editor.revealLineInCenter(startLine);
  }

  hideDecorations(): void {
    const model = this.editor.getModel();
    let current = model
      .getAllDecorations()
      .filter((item) => {
        const { className } = item.options;
        return className?.includes('playground-syntax');
      })
      .map((item) => item.id);

    model.deltaDecorations(current, []);
  }

  render() {
    const { type, code } = this.props;

    /// Get a list of args from language server
    const { activeId } = this.props;
    const { args, problems } = this.state;
    const list = args[activeId] || [];

    /// Extract number of signers from code
    const signers = this.extractSigners(code);
    const problemsList: ProblemsList = problems[activeId] || {
      error: [],
      warning: [],
      hint: [],
      info: [],
    };
    return (
      <EditorContainer id={this.props.mount}>
        <Arguments
          type={type}
          list={list}
          signers={signers}
          problems={problemsList}
          hover={(highlight) => this.hover(highlight)}
          hideDecorations={() => this.hideDecorations()}
          goTo={(position: monaco.IPosition) => goTo(this.editor, position)}
          editor={this.editor}
          languageClient={this.languageClient}
        />
      </EditorContainer>
    );
  }
}

export default CadenceEditor;
