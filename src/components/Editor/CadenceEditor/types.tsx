import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type EditorState = { model: monaco.editor.IModel; viewState: monaco.editor.ICodeEditorViewState | null };
