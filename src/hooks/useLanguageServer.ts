import { useEffect, useState, useRef } from 'react';
import { CadenceLanguageServer, Callbacks } from 'util/language-server';
import { MonacoServices } from 'monaco-languageclient/lib/monaco-services';
import * as monaco from 'monaco-editor';
import { createCadenceLanguageClient } from 'util/language-client';
import { useProject } from 'providers/Project/projectHooks';

let monacoServicesInstalled = false;

async function startLanguageServer(callbacks: any, getCode: any, ops) {
  const { setLanguageServer, setCallbacks } = ops;
  const server = await CadenceLanguageServer.create(callbacks);

  new Promise((resolve, reject) => {
    let checkInterval = setInterval(() => {
      // .toServer() method is populated by language server
      // if it was not properly started or in progress it will be "null"
      if (callbacks.toServer !== null) {
//         console.log(callbacks.toServer);
        clearInterval(checkInterval);
        callbacks.getAddressCode = getCode;
        setCallbacks(callbacks);
        setLanguageServer(server);
      }
    }, 100);
  });
}

const launchLanguageClient = async (
  callbacks,
  languageServer,
  setLanguageClient,
) => {
  if (!languageServer) {
    console.log('language server is not ready. waiting...');
  } else {
    console.log('language server is up. initiate client!');
    console.log(callbacks);
    const newClient = createCadenceLanguageClient(callbacks);
    newClient.start();
    await newClient.onReady();
    console.log('language client is up!');
    setLanguageClient(newClient);
  }
};

export default function useLanguageServer() {
  const project = useProject();
  window.project = project
  const accountUpdates = useRef(1);

  // Language Server Callbacks
  let initialCallbacks: Callbacks = {
    // The actual callback will be set as soon as the language server is initialized
    toServer: null,

    // The actual callback will be set as soon as the language server is initialized
    onClientClose: null,

    // The actual callback will be set as soon as the language client is initialized
    onServerClose: null,

    // The actual callback will be set as soon as the language client is initialized
    toClient: null,

    //@ts-ignore
    getAddressCode(address: string): string | undefined {
      // we will set it once it is instantiated
    },
  };

  // Base state handler
  const [languageServer, setLanguageServer] = useState(null);
  const [languageServerOpen, setLanguageServerOpen] = useState(false);

  const [languageClient, setLanguageClient] = useState(null);
  const [languageClientOpen, setLanguageClientOpen] = useState(false);

  const [initialized, setInitialized] = useState(false);
  const [callbacks, setCallbacks] = useState(initialCallbacks);

  const getCode = (address) => {
    console.log(`Version ${accountUpdates.current}`);
    const { accounts } = project.project;

    const number = parseInt(address, 16);
    if (!number) {
      return;
    }

    const index = number - 1;
    if (index < 0 || index >= accounts.length) {
      return;
    }
    let code = accounts[index].draftCode;

    console.log(code);
    return code;
  };

  const restartServer = () => {
    console.log("%c LS: Restarting",'color: #9727e9')
    // TODO: Clean global variables, so we could ensure there is no duplication of events and messages
    startLanguageServer(callbacks, getCode, {
      setLanguageServer,
      setCallbacks,
    });
  };

  useEffect(() => {
    accountUpdates.current += 1;
    console.log(accountUpdates.current);
/*    setCallbacks({
      ...callbacks,
      getAddressCode: getCode,
    });*/
/*    if(languageClient){
      languageClient.stop()
    }*/
    // launchLanguageClient(callbacks, languageServer, setLanguageClient).then();
    restartServer()
  }, [project.project.accounts]);

  useEffect(() => {
    // The Monaco Language Client services have to be installed globally, once.
    // An editor must be passed, which is only used for commands.
    // As the Cadence language server is not providing any commands this is OK

    console.log('Installing monaco services');
    if (!monacoServicesInstalled) {
      monacoServicesInstalled = true;
      MonacoServices.install(monaco);
    }

    restartServer();
  }, []);

  useEffect(() => {
    // TODO: postpone with this update
    // launchLanguageClient(callbacks, languageServer, setLanguageClient).then();
  }, [languageServer]);

  return {
    languageClient,
    languageClientOpen,
    languageServer,
    languageServerOpen,
    initialized,
    restartServer,
  };
}
