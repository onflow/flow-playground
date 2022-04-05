import { EntityType } from 'providers/Project';
import { Highlight, ProblemsList } from 'util/language-syntax-errors';
import * as monaco from 'monaco-editor';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { Argument } from 'components/Arguments/types';
import {Account} from "api/apollo/generated/graphql";

export interface IValue {
  [key: string]: string;
}

export type ControlPanelProps = {
  editor: any;
/*  type: EntityType;
  list: Argument[];
  signers: number;
  problems: ProblemsList;
  goTo: (position: monaco.IPosition) => void;
  hover: (highlight: Highlight) => void;
  hideDecorations: () => void;
  languageClient: MonacoLanguageClient;*/
};

export type ScriptExecution = (args?: string[]) => Promise<any>;
export type TransactionExecution = (
    signingAccounts: Account[],
    args?: string[],
) => Promise<any>;
export type DeployExecution = () => Promise<any>;

export type ProcessingArgs = {
  disabled: boolean;
  scriptFactory?: ScriptExecution;
  transactionFactory?: TransactionExecution;
  contractDeployment?: DeployExecution;
};
