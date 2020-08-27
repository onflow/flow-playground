import React from "react";
import styled from "@emotion/styled";
import configureMonaco from "../util/configure-monaco";

type EditorState = {
  model: any;
  viewState: any;
};

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
`;

class CadenceEditor extends React.Component<{
  code: string;
  mount: string;
  onChange: any;
  activeId: string;
}> {
  editor: any;
  _subscription: any;
  editorStates: { [key: string]: EditorState };
  monaco: any;

  constructor(props: {
    code: string;
    mount: string;
    onChange: any;
    activeId: string;
  }) {
    super(props);

    this.editorStates = {};

    if (typeof document !== "undefined") {
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener("resize", this.handleResize);
      // NOTE: monaco is browser-only, pre-render of the app is done via node;
      // Check if document exists to be sure we're in browser land
      // before loading monaco.
      this.monaco = require("monaco-editor");
      configureMonaco(this.monaco);
    }
  }

  handleResize() {
    this.editor && this.editor.layout();
  }

  componentDidMount() {
    if (typeof document !== "undefined") {
      this.monaco = require("monaco-editor");
      configureMonaco(this.monaco);
      const monacoOptions = {
        language: "Cadence",
        minimap: {
          enabled: false
        }
      };

      this.editor = this.monaco.editor.create(
        document.getElementById(this.props.mount),
        monacoOptions
      );

      this._subscription = this.editor.onDidChangeModelContent((event: any) => {
        const code = this.editor.getValue().replace(/\r\n/g, '\n')
        this.props.onChange(code, event);
      });

      const state = this.getOrCreateEditorState(
        this.props.activeId,
        this.props.code
      );
      this.editor.setModel(state.model);
      this.editor.focus();
    }
  }

  getOrCreateEditorState(id: string, code: string): EditorState {
    const existingState = this.editorStates[id];

    if (existingState !== undefined) {
      return existingState;
    }

    const model = this.monaco.editor.createModel(code, "Cadence");

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
    if (typeof document !== "undefined") {
      this.destroyMonaco();
      window.removeEventListener("resize", this.handleResize);
    }
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.activeId !== prevProps.activeId) {
      this.switchEditor(prevProps.activeId, this.props.activeId);
      this.destroyMonaco();
      this.componentDidMount();
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

  render() {
    return <EditorContainer id={this.props.mount} />;
  }
}

export default CadenceEditor;
