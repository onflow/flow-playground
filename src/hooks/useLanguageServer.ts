import { useEffect, useState } from 'react';
import { CadenceLanguageServer, Callbacks } from 'util/language-server';
import { MonacoServices } from 'monaco-languageclient/lib/monaco-services';
import * as monaco from 'monaco-editor';

let monacoServicesInstalled = false;

async function startLanguageServer(serverProps: any, setServer: any) {
  const { callbacks, getCode } = serverProps;
  const server = await CadenceLanguageServer.create(callbacks);

  new Promise((resolve, reject) => {
    let checkInterval = setInterval(() => {
      // .toServer() method is populated by language server
      // if it was not properly started or in progress it will be "null"
      if (callbacks.toServer !== null) {
        clearInterval(checkInterval);
        callbacks.getAddressCode = getCode;
        setServer(server);
      }
    }, 100);
  });
  setServer(server);
}

export default function useLanguageServer(props: any) {
  // Language Server Callbacks
  let callbacks: Callbacks = {
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
  const [languageClient, setLanguageClient] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const { getCode } = props;
  const restartServer = () => {
    // TODO: Clean global variables, so we could ensure there is no duplication of events and messages
    startLanguageServer({ callbacks, getCode }, setLanguageServer);
  };
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

  return [languageClient, languageServer, initialized, restartServer];
}
