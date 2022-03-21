import React, { useState, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';
import { EditorContainer } from './components';
import { useProject } from 'providers/Project/projectHooks';
import useLanguageServer from '../../hooks/useLanguageServer';

const MONACO_CONTAINER_ID = 'monaco-container';

type EditorState = {
  model: any;
  viewState: any;
};

const EnhancedEditor = (props: any) => {
  const project = useProject();

  const cadenceInitiated = useRef(false);
  const [editor, setEditor] = useState(null);

  const { languageClient } = useLanguageServer({
    getCode: (index) => {
      console.log('Requesting code for: ', { index });
    },
  });

  const [editorStates, setEditorStates] = useState({});

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

  const getActiveCode = () => {
    const { active } = project;
    const { accounts, scriptTemplates, transactionTemplates } = project.project;

    const { type, index } = active;
    let code, id;
    switch (type) {
      case 1:
        code = accounts[index].draftCode;
        id = accounts[index].id;
        break;
      case 2:
        code = transactionTemplates[index].script;
        id = transactionTemplates[index].id
        break;
      case 3:
        code = scriptTemplates[index].script;
        id = scriptTemplates[index].id
        break;
      default:
        code = 'not support type';
    }
    return [code, id];
  };

  // TODO: tie-in Monaco with project updates
  // TODO: tie-in language-client server with project updates
  // TODO: delay language client checks
  // TODO: add manual request to trigger check

  useEffect(() => {
    if (cadenceInitiated.current === false) {
      console.log('Init Cadence');
      // Step1 - Configure global monaco to support Cadence
      configureCadence();
      cadenceInitiated.current = true;
    } else {
      console.log('No need :)');
    }
  }, []);

  useEffect(() => {
    if(editor){
      const [code, newId] = getActiveCode();
      const newState = getOrCreateEditorState(newId, code);

      editor.setModel(newState.model);
      editor.restoreViewState(newState.viewState);
      editor.focus();
    }
  }, [project.active]);

  const destroyEditor = () => {
    editor.dispose();
  };

  const initEditor = async () => {
    const container = document.getElementById(MONACO_CONTAINER_ID);
    const editor = monaco.editor.create(container, {
      theme: 'vs-light',
      language: CADENCE_LANGUAGE_ID,
      minimap: {
        enabled: false,
      },
    });

    setEditor(editor);

    editor.onDidChangeModelContent((event: any) => {
      console.log(editor.getValue());
      console.log({ event });
    });

    const model = monaco.editor.createModel(
      'hello, world',
      CADENCE_LANGUAGE_ID,
    );
    const state: EditorState = {
      model,
      viewState: null,
    };
    editor.setModel(state.model);
    editor.restoreViewState(state.viewState);
    editor.focus();

    window.addEventListener('resize', () => {
      console.log('update');
      editor && editor.layout();
    });
  };

  useEffect(() => {
    // Drop returned Promise
    initEditor().then();

    return () => {
      if (editor) {
        destroyEditor();
      }
    };
  }, []);

  return <EditorContainer id={MONACO_CONTAINER_ID} />;
};

export default EnhancedEditor;
