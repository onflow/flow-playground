import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { extractSigners } from "util/parser";


import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';
import {
  CadenceCheckCompleted,
  CadenceLanguageServer,
  Callbacks,
} from 'util/language-server';
import { createCadenceLanguageClient } from 'util/language-client';
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
import { WithShowProps } from "containers/Editor/components";

const blink = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const EditorContainer = styled.div<WithShowProps>`
  width: 100%;
  height: 100%;
  position: relative;

  display: ${({ show }) => (show ? 'block' : 'none')};
  
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

type CadenceEditorProps = {
  type: EntityType;
  code: string;
  mount: string;
  show: boolean;
  onChange: any;
  activeId: string;
  languageServer: CadenceLanguageServer
  callbacks: Callbacks
  serverReady: boolean
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
  clients: { [key: string]: MonacoLanguageClient }
  private callbacks: Callbacks;

  constructor(props: {
    code: string;
    mount: string;
    show: boolean;
    onChange: any;
    activeId: string;
    type: EntityType;
    languageServer: any;
    callbacks: Callbacks;
    serverReady: boolean;
  }) {
    super(props);

    this.editorStates = {};
    this.clients = {};
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
    await this.initEditor()

    if (this.props.serverReady) {
      await this.loadLanguageClient()
    }
  }

  async initEditor() {
    this.editor = monaco.editor.create(
      document.getElementById(this.props.mount),
      {
        theme: 'vs-light',
        language: CADENCE_LANGUAGE_ID,
        minimap: {
          enabled: false,
        },
      },
    );
    this._subscription = this.editor.onDidChangeModelContent((event: any) => {
      this.props.onChange(this.editor.getValue(), event);
    });

    const state = this.getOrCreateEditorState(
      this.props.activeId,
      this.props.code,
    );
    this.editor.setModel(state.model);
    this.editor.focus();
  }

  private async loadLanguageClient() {
    this.callbacks = this.props.callbacks;
    const clientId = this.props.activeId;
    if(!this.clients[clientId]){
      this.languageClient = createCadenceLanguageClient(this.callbacks);
      this.languageClient.start();
      await this.languageClient.onReady()
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
      this.clients[clientId] = this.languageClient;
    } else {
      this.languageClient = this.clients[clientId]
    }

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
      await this.swapMonacoEditor(prevProps.activeId, this.props.activeId)
    }

    const serverStatusChanged = this.props.serverReady !== prevProps.serverReady
    const activeIdChanged = this.props.activeId !== prevProps.activeId
    const typeChanged = this.props.type !== prevProps.type

    if (serverStatusChanged || activeIdChanged || typeChanged) {
      if (this.props.callbacks.toServer !== null) {
        await this.loadLanguageClient()
      }
    }
  }

  async swapMonacoEditor(prev: any, current: any) {
    await this.destroyMonaco();
    await this.initEditor();
    this.switchEditor(prev, current);
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
    const { type, code, show } = this.props;

    /// Get a list of args from language server
    const { activeId } = this.props;
    const { args, problems } = this.state;
    const list = args[activeId] || [];

    /// Extract number of signers from code
    const signers = extractSigners(code).length
    const problemsList: ProblemsList = problems[activeId] || {
      error: [],
      warning: [],
      hint: [],
      info: [],
    };
    return (
      <EditorContainer id={this.props.mount} show={show}>
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
