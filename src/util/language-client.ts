
import {CADENCE_LANGUAGE_ID} from './cadence'
import {Callbacks} from './language-server'
import {
  createMessageConnection,
  DataCallback,
  Disposable,
  Logger,
  Message,
  MessageReader,
  MessageWriter,
  PartialMessageInfo
} from "vscode-jsonrpc";
import {ConnectionErrorHandler} from "monaco-languageclient/src/connection"
import {ConnectionCloseHandler} from "monaco-languageclient"

export function createCadenceLanguageClient(callbacks: Callbacks) {
  const logger: Logger = {
    error(message: string) {
      console.error(message)
    },
    warn(message: string) {
      console.warn(message)
    },
    info(message: string) {
      console.info(message)
    },
    log(message: string) {
      console.log(message)
    },
  }

  const writer: MessageWriter = {
    onClose(_: (_: void) => void): Disposable {
      return Disposable.create(() => {
      })
    },
    onError(_: (error: [Error, Message, number]) => void): Disposable {
      return Disposable.create(() => {
      })
    },
    write(msg: Message) {
      callbacks.toServer(null, msg)
    },
    dispose() {
      callbacks.onClientClose()
    }
  }

  const reader: MessageReader = {
    onError(_: (error: Error) => void): Disposable {
      return Disposable.create(() => {
      })
    },
    onClose(_: (_: void) => void): Disposable {
      return Disposable.create(() => {
      })
    },
    onPartialMessage(_: (m: PartialMessageInfo) => void): Disposable {
      return Disposable.create(() => {
      })
    },
    listen(dataCallback: DataCallback) {
      callbacks.toClient = (message) => dataCallback(message)
    },
    dispose() {
      callbacks.onClientClose()
    }
  }

  const messageConnection = createMessageConnection(reader, writer, logger)

  const {CloseAction, createConnection, ErrorAction, MonacoLanguageClient} = require("monaco-languageclient");

  return new MonacoLanguageClient({
    name: "Cadence Language Client",
    clientOptions: {
      documentSelector: [CADENCE_LANGUAGE_ID],
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart
      }
    },
    // Create a language client connection from the JSON-RPC connection on demand
    connectionProvider: {
      get: (errorHandler: ConnectionErrorHandler, closeHandler: ConnectionCloseHandler) => {
        return Promise.resolve(createConnection(messageConnection, errorHandler, closeHandler))
      }
    }
  });
}
