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
} from "vscode-jsonrpc"
import {ConnectionErrorHandler} from "monaco-languageclient/src/connection"
import {ConnectionCloseHandler, CloseAction, createConnection, ErrorAction, MonacoLanguageClient} from "monaco-languageclient"

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
    async write(msg: Message): Promise<void> {
      callbacks.toServer(null, msg)
    },
    end() {},
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
    listen(dataCallback: DataCallback): Disposable {
      callbacks.toClient = (message) => dataCallback(message)
      return Disposable.create(() => {
      })
    },
    dispose() {
      console.log("-------------------------->", "Language Client is closed. Do something!")
      callbacks.onClientClose()
    }
  }

  const messageConnection = createMessageConnection(reader, writer, logger)

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
