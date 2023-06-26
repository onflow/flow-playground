import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { EntityType } from 'providers/Project';
import {
  CadenceProblem,
  Highlight,
  ProblemsList,
} from 'util/language-syntax-errors';

export type InteractionButtonProps = {
  onClick: () => void;
  enabled?: boolean;
  progress?: boolean;
  selectedAccounts: number[];
  label: string;
};

export type Argument = {
  name: string;
  type: string;
  unsupported: boolean;
};

export type ArgumentsProps = {
  type: EntityType;
  list: Argument[];
  signers: number;
  problems: ProblemsList;
  goTo: (position: monaco.IPosition) => void;
  hover: (highlight: Highlight) => void;
  hideDecorations: () => void;
  editor: any;
  languageClient: MonacoLanguageClient;
};

export type ArgumentsTitleProps = {
  type: EntityType;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  errors?: number;
};

export type ArgumentsListProps = {
  list: Argument[];
  hidden: boolean;
  onChange: (name: String, value: any) => void;
  errors: any;
};

export type Actions = {
  goTo: (position: monaco.IPosition) => void;
  hover: (highlight: Highlight) => void;
  hideDecorations: () => void;
};

export type ErrorListProps = {
  list: CadenceProblem[];
  actions: Actions;
};

export type HintsProps = {
  problems: ProblemsList;
  actions: Actions;
};

export type HintsState = {
  expanded: boolean;
};
