import React from "react";
import styled from "@emotion/styled";
import configureMonaco, {CADENCE_LANGUAGE_ID} from "../util/configure-monaco";
import * as monaco from "monaco-editor"

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
  editor: monaco.editor.ICodeEditor;
  _subscription: any;
  editorStates: { [key: string]: EditorState };

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
      configureMonaco();
    }
  }

  handleResize() {
    this.editor && this.editor.layout();
  }

  componentDidMount() {
    if (typeof document !== "undefined") {
      configureMonaco();
      const monacoOptions = {
        language: CADENCE_LANGUAGE_ID,
        minimap: {
          enabled: false
        }
      };

      this.editor = monaco.editor.create(
        document.getElementById(this.props.mount),
        monacoOptions
      );

      this._subscription = this.editor.onDidChangeModelContent((event: any) => {
        this.props.onChange(this.editor.getValue(), event);
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
