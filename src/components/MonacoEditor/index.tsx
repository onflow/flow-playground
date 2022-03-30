import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import configureCadence, { CADENCE_LANGUAGE_ID } from 'util/cadence';
import { EditorContainer } from './components';
import { useProject } from 'providers/Project/projectHooks';
import debounce from 'util/debounce';

const MONACO_CONTAINER_ID = 'monaco-container';

type EditorState = {
  model: any;
  viewState: any;
};

const updateActiveCode = (editor, project, event) => {
  console.log(project.active);

  if (editor) {
    // TODO: delay updates a bit...
    const currentValue = editor.getValue();
    const { active } = project;

    console.log('+++++++++++++++++++++++++', project.active);

    // TODO: finish transactions
    switch (active.type) {
      case EntityType.Account:
        console.log('Update account');
        const { updateAccountDraftCode } = project;
        updateAccountDraftCode(currentValue).then();
        break;
      case EntityType.ScriptTemplate:
        console.log('Update script');
        const { updateScriptTemplate } = project;
        const { id } = project.project.scriptTemplates[active.index];
        updateScriptTemplate(id, currentValue, '---').then();
        break;
      default:
        break;
    }
  }
};

const EnhancedEditor = (props: any) => {
  const project = useProject();
  console.log('------------------------>', project.active);

  const cadenceInitiated = useRef(false);
  const editor = useRef(null);

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
        id = transactionTemplates[index].id;
        break;
      case 3:
        code = scriptTemplates[index].script;
        id = scriptTemplates[index].id;
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
    if (editor.current) {
      const [code, newId] = getActiveCode();
      const newState = getOrCreateEditorState(newId, code);

      editor.current.setModel(newState.model);
      editor.current.restoreViewState(newState.viewState);
      editor.current.focus();
    }
  }, [project.active]);

  const destroyEditor = () => {
    editor.current.dispose();
  };

  const initEditor = async () => {
    const container = document.getElementById(MONACO_CONTAINER_ID);
    editor.current = monaco.editor.create(container, {
      theme: 'vs-light',
      language: CADENCE_LANGUAGE_ID,
      minimap: {
        enabled: false,
      },
    });

    // Setup even listener when code is updated
    editor.current.onDidChangeModelContent((event) => {
      console.log('update', event);
      updateActiveCode(editor.current, project, event);
    });

    const model = monaco.editor.createModel(
      'hello, world',
      CADENCE_LANGUAGE_ID,
    );
    const state: EditorState = {
      model,
      viewState: null,
    };
    editor.current.setModel(state.model);
    editor.current.restoreViewState(state.viewState);
    editor.current.focus();

    window.addEventListener('resize', () => {
      console.log('update');
      editor && editor.current.layout();
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
