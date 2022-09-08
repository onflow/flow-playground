import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { useProject } from 'providers/Project/projectHooks';
import { EntityType } from 'providers/Project';
import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';

import Notifications from './Notifications';
import ControlPanel from './ControlPanel';
import { EditorContainer } from './components';

import { EditorState } from './types';

const MONACO_CONTAINER_ID = 'monaco-container';

const CadenceEditor = (props: any) => {
  const project = useProject();
  const [editor, setEditor] = useState(null);
  const editorOnChange = useRef(null);
  // We will specify type as index as non-existent numbers to prevent collision with existing enums
  const lastEdit = useRef({
    type: 8,
    index: 8,
  });

  const [editorStates, setEditorStates] = useState({});

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
  const getOrCreateEditorState = (id: string, code: string): EditorState => {
    const existingState = editorStates[id];

    if (existingState !== undefined) {
      return existingState;
    }

    const newState = {
      model: monaco.editor.createModel(code, CADENCE_LANGUAGE_ID),
      viewState: null,
    };

    setEditorStates({
      ...editorStates,
      [id]: newState,
    });

    return newState;
  };

  // "getActiveCode" is used to read Cadence code from active(selected) item
  const getActiveCode = () => {
    const { active } = project;
    const { accounts, scriptTemplates, transactionTemplates } = project.project;

    const { type, index } = active;
    let code, id;
    switch (type) {
      case EntityType.Account:
        code = accounts[index].draftCode;
        id = accounts[index].id;
        break;
      case EntityType.TransactionTemplate:
        code = transactionTemplates[index].script;
        id = transactionTemplates[index].id;
        break;
      case EntityType.ScriptTemplate:
        code = scriptTemplates[index].script;
        id = scriptTemplates[index].id;
        break;
      default:
        code = '';
        id = 8;
    }
    return [code, id];
  };

  //@ts-ignore
  const setupEditor = () => {
    const projectExist = project && project.project.accounts;
    if (editor && projectExist) {
      if (editorOnChange.current) {
        editorOnChange.current.dispose();
      }

      // To pick up new changes in accounts, we will track project's active item and then add and remove
      // new line at EOF to trick Language Client to send code changes and reimport the latest changes,
      // clearing errors and warning about missing fields.
      const [code, newId] = getActiveCode();
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

        setTimeout(() => {
          newState.model.setValue(code);
        }, 100);
      }
      editorOnChange.current = editor.onDidChangeModelContent(() => {
        if (project.project?.accounts) {
          // we will ignore text line, cause onChange is based on active type
          // @ts-ignore
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
    });

    const [code] = getActiveCode();
    const model = monaco.editor.createModel(code, CADENCE_LANGUAGE_ID);
    const state: EditorState = {
      model,
      viewState: null,
    };
    editor.setModel(state.model);
    editor.restoreViewState(state.viewState);
    editor.focus();
    editor.layout();

    window.addEventListener('resize', () => {
      /* eslint-disable */
      editor && editor.layout();
    });

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
    /* eslint-disable */
    initEditor().then(); // drop returned Promise as we are not going to use it
    return () => {
      editor && destroyEditor();
    };
  }, []);

  return (
    <EditorContainer id={MONACO_CONTAINER_ID} show={props.show}>
      <ControlPanel editor={editor} />
      <Notifications />
    </EditorContainer>
  );
};

export default CadenceEditor;
