import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useProject } from 'providers/Project/projectHooks';
import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';
import { EditorContainer } from './components';
import ControlPanel from './ControlPanel';
import Notifications from './Notifications';
import { EditorState } from './types';
import { EntityType } from 'providers/Project';

const MONACO_CONTAINER_ID = 'monaco-container';

type EditorStates = Record<number, EditorState>;

const CadenceEditor = (props: any) => {
  const project = useProject();
  const [editor, setEditor] = useState(null);
  const editorOnChange = useRef(null);
  // We will specify type as index as non-existent numbers to prevent collision with existing enums
  const lastEdit = useRef({
    type: 8,
    index: 8,
  });

  const [editorStates, setEditorStates] = useState<EditorStates>({});
  const { width, height, ref } = useResizeDetector();
  // TODO: restore view state in next implementation
  /*
  const saveEditorState = (id: string, viewState: any) => {
    setEditorStates({
      ...editorStates,
      [id]: viewState,
    });
  };
   */

  // This method is used to retrieve previous MonacoEditor state
  const getOrCreateEditorState = (id: number, code: string): EditorState => {
    const existingState = editorStates[id];

    if (existingState !== undefined) {
      return existingState;
    }

    const newState: EditorState =
      project.active.type == EntityType.AccountStorage
        ? { model: monaco.editor.createModel(code, 'json'), viewState: null }
        : {
            model: monaco.editor.createModel(code, CADENCE_LANGUAGE_ID),
            viewState: null,
          };

    setEditorStates({
      ...editorStates,
      [id]: newState,
    });

    return newState;
  };

  const setupEditor = () => {
    const projectExist = project && project.project.accounts;
    if (editor && projectExist) {
      if (editorOnChange.current) {
        editorOnChange.current.dispose();
      }
      if (project.active.type === EntityType.AccountStorage) {
        editor.updateOptions({ readOnly: true });
      } else {
        editor.updateOptions({ readOnly: false });
      }
      // To pick up new changes in accounts, we will track project's active item and then add and remove
      // new line at EOF to trick Language Client to send code changes and reimport the latest changes,
      // clearing errors and warning about missing fields.
      const [code, newId] = project.getActiveCode();
      const newState = getOrCreateEditorState(newId, code);
      if (
        lastEdit.current.type == project.active.type &&
        lastEdit.current.index == project.active.index
      ) {
        editor.setModel(newState.model);
        editor.restoreViewState(newState.viewState);
        editor.focus();
      } else {
        // - Add new line at the end of the model
        // Remove tracking of model updates to prevent re-rendering
        if (editorOnChange.current) {
          editorOnChange.current.dispose();
        }

        newState.model.setValue(code + '\n');
        lastEdit.current = {
          type: project.active.type,
          index: project.active.index,
        };

        // - Mark last edited as type, index, edited = true
        editor.setModel(newState.model);
        editor.restoreViewState(newState.viewState);
        editor.focus();
        editor.layout();

        newState.model.setValue(code);
      }
      editorOnChange.current = editor.onDidChangeModelContent(() => {
        if (project.project?.accounts) {
          project.active.onChange(editor.getValue());
        }
      });
    }
  };

  useEffect(() => {
    configureCadence();
  }, []);

  useEffect(() => {
    if (editor) {
      setupEditor();
    }
  }, [
    editor,
    project.active.index,
    project.active.type,
    project.project.accounts,
    project.project?.id
  ]);

  // "initEditor" will create new instance of Monaco Editor and set it up
  const initEditor = async () => {
    const container = document.getElementById(MONACO_CONTAINER_ID);

    const editor = monaco.editor.create(container, {
      theme: 'vs-light',
      language: CADENCE_LANGUAGE_ID,
      minimap: {
        enabled: false,
      },
      readOnly: project.active.type === EntityType.AccountStorage,
    });

    const [code] = project.getActiveCode();
    const model = monaco.editor.createModel(code, CADENCE_LANGUAGE_ID);
    const state: EditorState = {
      model,
      viewState: null,
    };
    editor.setModel(state.model);
    editor.restoreViewState(state.viewState);
    editor.focus();
    editor.layout();

    // Save editor in component state
    setEditor(editor);
    setupEditor();
  };

  // "destroyEditor" is used to dispose of Monaco Editor instance, when the component is unmounted (for any reasons)
  const destroyEditor = () => {
    editor.dispose();
  };

  // Do it once, when CadenceEditor component is instantiated
  useEffect(() => {
    initEditor().then(); // drop returned Promise as we are not going to use it
    return () => {
      if (editor) destroyEditor();
    };
  }, []);

  useEffect(() => {
    if (editor) editor.layout();
  }, [width, height, editor]);

  return (
    <EditorContainer id={MONACO_CONTAINER_ID} show={props.show} ref={ref}>
      {!!editor && (
        <ControlPanel
          problemsList={props.problemsList}
          setProblemsList={props.setProblemsList}
          editor={editor}
        />
      )}
      <Notifications />
    </EditorContainer>
  );
};

export default CadenceEditor;
