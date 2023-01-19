import { Account } from 'api/apollo/generated/graphql';
import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api';

export interface IValue {
  [key: string]: string;
}

export type ControlPanelProps = {
  problemsList: any;
  setProblemsList: any;
  editor: monacoEditor.ICodeEditor;
};

export type ScriptExecution = (args?: string[]) => Promise<any>;
export type TransactionExecution = (
  signingAccounts: Account[],
  args?: string[],
) => Promise<any>;
export type DeployExecution = (
  fileIndex: number,
  accountId: number,
) => Promise<any>;

export type ProcessingArgs = {
  disabled: boolean;
  scriptFactory?: ScriptExecution;
  transactionFactory?: TransactionExecution;
  contractDeployment?: DeployExecution;
};
