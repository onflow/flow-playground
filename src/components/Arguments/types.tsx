import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { EntityType } from 'providers/Project';
import {
  CadenceProblem,
  Highlight,
  ProblemsList,
} from 'util/language-syntax-errors';
import { MonacoLanguageClient } from 'monaco-languageclient';

export type InteractionButtonProps = {
  onClick: () => void;
  active?: boolean;
  type: EntityType;
};

export type Argument = {
  name: string;
  type: string;
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
}

export type ErrorListProps = {
  list: CadenceProblem[];
  actions: Actions
};

export type HintsProps = {
  problems: ProblemsList;
  actions: Actions
};

export type HintsState = {
  expanded: boolean;
};
