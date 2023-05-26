import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Address: any;
  ExecutionResultValue: any;
  RawExecutionResult: any;
  UUID: any;
  Version: any;
};

export type Account = {
  __typename?: 'Account';
  address: Scalars['Address'];
  deployedContracts: Array<Scalars['String']>;
  state: Scalars['String'];
};


export type ContractDeployment = {
  __typename?: 'ContractDeployment';
  id: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
  address: Scalars['Address'];
  errors?: Maybe<Array<ProgramError>>;
  events?: Maybe<Array<Event>>;
  logs?: Maybe<Array<Scalars['String']>>;
  blockHeight?: Maybe<Scalars['Int']>;
};

export type ContractTemplate = {
  __typename?: 'ContractTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  type: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type ExecutionResult = {
  __typename?: 'ExecutionResult';
  timestamp?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['ExecutionResultValue']>;
  label?: Maybe<Scalars['String']>;
};

export type ExecutionResultInput = {
  data?: Maybe<Scalars['RawExecutionResult']>;
};


export type ExecutionResults = {
  __typename?: 'ExecutionResults';
  TRANSACTION?: Maybe<Array<Maybe<ExecutionResult>>>;
  SCRIPT?: Maybe<Array<Maybe<ExecutionResult>>>;
  CONTRACT?: Maybe<Array<Maybe<ExecutionResult>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  clearCachedExecutionResults?: Maybe<Scalars['Boolean']>;
  createContractDeployment: ContractDeployment;
  createContractTemplate: ContractTemplate;
  createProject: Project;
  createScriptExecution: ScriptExecution;
  createScriptTemplate: ScriptTemplate;
  createTransactionExecution: TransactionExecution;
  createTransactionTemplate: TransactionTemplate;
  deleteContractTemplate: Scalars['UUID'];
  deleteProject: Scalars['UUID'];
  deleteScriptTemplate: Scalars['UUID'];
  deleteTransactionTemplate: Scalars['UUID'];
  setActiveProjectId?: Maybe<Scalars['Boolean']>;
  updateCachedExecutionResults?: Maybe<Scalars['Boolean']>;
  updateContractTemplate: ContractTemplate;
  updateProject: Project;
  updateScriptTemplate: ScriptTemplate;
  updateTransactionTemplate: TransactionTemplate;
};


export type MutationClearCachedExecutionResultsArgs = {
  resultType: ResultType;
};


export type MutationCreateContractDeploymentArgs = {
  input: NewContractDeployment;
};


export type MutationCreateContractTemplateArgs = {
  input: NewContractTemplate;
};


export type MutationCreateProjectArgs = {
  input: NewProject;
};


export type MutationCreateScriptExecutionArgs = {
  input: NewScriptExecution;
};


export type MutationCreateScriptTemplateArgs = {
  input: NewScriptTemplate;
};


export type MutationCreateTransactionExecutionArgs = {
  input: NewTransactionExecution;
};


export type MutationCreateTransactionTemplateArgs = {
  input: NewTransactionTemplate;
};


export type MutationDeleteContractTemplateArgs = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['UUID'];
};


export type MutationDeleteScriptTemplateArgs = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export type MutationDeleteTransactionTemplateArgs = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export type MutationSetActiveProjectIdArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type MutationUpdateCachedExecutionResultsArgs = {
  resultType: ResultType;
  rawResult: Scalars['RawExecutionResult'];
  label?: Maybe<Scalars['String']>;
};


export type MutationUpdateContractTemplateArgs = {
  input: UpdateContractTemplate;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProject;
};


export type MutationUpdateScriptTemplateArgs = {
  input: UpdateScriptTemplate;
};


export type MutationUpdateTransactionTemplateArgs = {
  input: UpdateTransactionTemplate;
};

export type NewContractDeployment = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  address: Scalars['Address'];
};

export type NewContractTemplate = {
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewFile = {
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewProject = {
  parentId?: Maybe<Scalars['UUID']>;
  title: Scalars['String'];
  description: Scalars['String'];
  readme: Scalars['String'];
  seed: Scalars['Int'];
  numberOfAccounts: Scalars['Int'];
  transactionTemplates?: Maybe<Array<NewProjectTransactionTemplate>>;
  scriptTemplates?: Maybe<Array<NewProjectScriptTemplate>>;
  contractTemplates?: Maybe<Array<NewProjectContractTemplate>>;
};

export type NewProjectContractTemplate = {
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewProjectFile = {
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewProjectScriptTemplate = {
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewProjectTransactionTemplate = {
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewScriptExecution = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']>>;
};

export type NewScriptTemplate = {
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewTransactionExecution = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  signers?: Maybe<Array<Scalars['Address']>>;
  arguments?: Maybe<Array<Scalars['String']>>;
};

export type NewTransactionTemplate = {
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type PlaygroundInfo = {
  __typename?: 'PlaygroundInfo';
  apiVersion: Scalars['Version'];
  cadenceVersion: Scalars['Version'];
  emulatorVersion: Scalars['Version'];
};

export type ProgramError = {
  __typename?: 'ProgramError';
  message: Scalars['String'];
  startPosition?: Maybe<ProgramPosition>;
  endPosition?: Maybe<ProgramPosition>;
};

export type ProgramPosition = {
  __typename?: 'ProgramPosition';
  offset: Scalars['Int'];
  line: Scalars['Int'];
  column: Scalars['Int'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['UUID'];
  publicId: Scalars['UUID'];
  parentId?: Maybe<Scalars['UUID']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  readme?: Maybe<Scalars['String']>;
  seed: Scalars['Int'];
  version: Scalars['Version'];
  persist?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['String'];
  mutable?: Maybe<Scalars['Boolean']>;
  numberOfAccounts: Scalars['Int'];
  accounts?: Maybe<Array<Account>>;
  transactionTemplates?: Maybe<Array<TransactionTemplate>>;
  transactionExecutions?: Maybe<Array<TransactionExecution>>;
  scriptTemplates?: Maybe<Array<ScriptTemplate>>;
  scriptExecutions?: Maybe<Array<ScriptExecution>>;
  contractTemplates?: Maybe<Array<ContractTemplate>>;
  contractDeployments?: Maybe<Array<ContractDeployment>>;
};

export type ProjectList = {
  __typename?: 'ProjectList';
  projects?: Maybe<Array<Project>>;
};

export type Query = {
  __typename?: 'Query';
  account: Account;
  activeProject: Scalars['Boolean'];
  activeProjectId?: Maybe<Scalars['Int']>;
  cachedExecutionResults: Array<Maybe<ExecutionResults>>;
  contractTemplate: ContractTemplate;
  localProject?: Maybe<Project>;
  playgroundInfo: PlaygroundInfo;
  project: Project;
  projectList: ProjectList;
  projects: Array<Maybe<Project>>;
  scriptTemplate: ScriptTemplate;
  transactionTemplate: TransactionTemplate;
};


export type QueryAccountArgs = {
  accountId?: Maybe<Scalars['String']>;
  address: Scalars['Address'];
  projectId: Scalars['UUID'];
};


export type QueryContractTemplateArgs = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export type QueryProjectArgs = {
  id: Scalars['UUID'];
};


export type QueryScriptTemplateArgs = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export type QueryTransactionTemplateArgs = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export enum ResultType {
  Transaction = 'TRANSACTION',
  Script = 'SCRIPT',
  Contract = 'CONTRACT'
}

export type ScriptExecution = {
  __typename?: 'ScriptExecution';
  id: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']>>;
  errors?: Maybe<Array<ProgramError>>;
  value: Scalars['String'];
  logs: Array<Scalars['String']>;
};

export type ScriptTemplate = {
  __typename?: 'ScriptTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type TransactionExecution = {
  __typename?: 'TransactionExecution';
  id: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']>>;
  signers: Array<Scalars['Address']>;
  errors?: Maybe<Array<ProgramError>>;
  events: Array<Maybe<Event>>;
  logs: Array<Scalars['String']>;
};

/**
 * type File {
 *   id: UUID!
 *   index: Int!
 *   title: String!
 *   type: Int!
 *   script: String!
 * }
 */
export type TransactionTemplate = {
  __typename?: 'TransactionTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};


export type UpdateContractTemplate = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
};

export type UpdateFile = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
};

export type UpdateProject = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  readme?: Maybe<Scalars['String']>;
  persist?: Maybe<Scalars['Boolean']>;
};

export type UpdateScriptTemplate = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
};

export type UpdateTransactionTemplate = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
};


export type CreateProjectMutationVariables = Exact<{
  parentId?: Maybe<Scalars['UUID']>;
  title: Scalars['String'];
  description: Scalars['String'];
  readme: Scalars['String'];
  seed: Scalars['Int'];
  numberOfAccounts: Scalars['Int'];
  transactionTemplates: Array<NewProjectTransactionTemplate> | NewProjectTransactionTemplate;
  scriptTemplates: Array<NewProjectScriptTemplate> | NewProjectScriptTemplate;
  contractTemplates: Array<NewProjectContractTemplate> | NewProjectContractTemplate;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { project: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'persist' | 'mutable' | 'parentId' | 'seed' | 'title' | 'description' | 'readme'>
    & { accounts?: Maybe<Array<(
      { __typename?: 'Account' }
      & Pick<Account, 'address' | 'deployedContracts' | 'state'>
    )>>, transactionTemplates?: Maybe<Array<(
      { __typename?: 'TransactionTemplate' }
      & Pick<TransactionTemplate, 'id' | 'script' | 'title'>
    )>>, scriptTemplates?: Maybe<Array<(
      { __typename?: 'ScriptTemplate' }
      & Pick<ScriptTemplate, 'id' | 'script' | 'title'>
    )>>, contractTemplates?: Maybe<Array<(
      { __typename?: 'ContractTemplate' }
      & Pick<ContractTemplate, 'id' | 'script' | 'title'>
    )>> }
  ) }
);

export type UpdateProjectMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  description: Scalars['String'];
  readme: Scalars['String'];
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'persist' | 'title' | 'description' | 'readme'>
  ) }
);

export type SetActiveProjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SetActiveProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setActiveProjectId'>
);

export type CreateContractTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
}>;


export type CreateContractTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createContractTemplate: (
    { __typename?: 'ContractTemplate' }
    & Pick<ContractTemplate, 'id' | 'script' | 'title'>
  ) }
);

export type UpdateContractTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  templateId: Scalars['UUID'];
  script: Scalars['String'];
  title?: Maybe<Scalars['String']>;
}>;


export type UpdateContractTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateContractTemplate: (
    { __typename?: 'ContractTemplate' }
    & Pick<ContractTemplate, 'id' | 'script' | 'index' | 'title'>
  ) }
);

export type DeleteContractTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  templateId: Scalars['UUID'];
}>;


export type DeleteContractTemplateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteContractTemplate'>
);

export type CreateContractDeploymentMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  signer: Scalars['Address'];
}>;


export type CreateContractDeploymentMutation = (
  { __typename?: 'Mutation' }
  & { createContractDeployment: (
    { __typename?: 'ContractDeployment' }
    & Pick<ContractDeployment, 'id' | 'script' | 'logs'>
    & { errors?: Maybe<Array<(
      { __typename?: 'ProgramError' }
      & Pick<ProgramError, 'message'>
      & { startPosition?: Maybe<(
        { __typename?: 'ProgramPosition' }
        & Pick<ProgramPosition, 'offset' | 'line' | 'column'>
      )>, endPosition?: Maybe<(
        { __typename?: 'ProgramPosition' }
        & Pick<ProgramPosition, 'offset' | 'line' | 'column'>
      )> }
    )>>, events?: Maybe<Array<(
      { __typename?: 'Event' }
      & Pick<Event, 'type' | 'values'>
    )>> }
  ) }
);

export type UpdateTransactionTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  templateId: Scalars['UUID'];
  script: Scalars['String'];
  title?: Maybe<Scalars['String']>;
}>;


export type UpdateTransactionTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateTransactionTemplate: (
    { __typename?: 'TransactionTemplate' }
    & Pick<TransactionTemplate, 'id' | 'script' | 'index' | 'title'>
  ) }
);

export type CreateTransactionTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
}>;


export type CreateTransactionTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createTransactionTemplate: (
    { __typename?: 'TransactionTemplate' }
    & Pick<TransactionTemplate, 'id' | 'script' | 'title'>
  ) }
);

export type DeleteTransactionTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  templateId: Scalars['UUID'];
}>;


export type DeleteTransactionTemplateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTransactionTemplate'>
);

export type CreateTransactionExecutionMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  signers?: Maybe<Array<Scalars['Address']> | Scalars['Address']>;
  arguments?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type CreateTransactionExecutionMutation = (
  { __typename?: 'Mutation' }
  & { createTransactionExecution: (
    { __typename?: 'TransactionExecution' }
    & Pick<TransactionExecution, 'id' | 'script' | 'logs'>
    & { errors?: Maybe<Array<(
      { __typename?: 'ProgramError' }
      & Pick<ProgramError, 'message'>
      & { startPosition?: Maybe<(
        { __typename?: 'ProgramPosition' }
        & Pick<ProgramPosition, 'offset' | 'line' | 'column'>
      )>, endPosition?: Maybe<(
        { __typename?: 'ProgramPosition' }
        & Pick<ProgramPosition, 'offset' | 'line' | 'column'>
      )> }
    )>>, events: Array<Maybe<(
      { __typename?: 'Event' }
      & Pick<Event, 'type' | 'values'>
    )>> }
  ) }
);

export type UpdateScripTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  templateId: Scalars['UUID'];
  script: Scalars['String'];
  title?: Maybe<Scalars['String']>;
}>;


export type UpdateScripTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateScriptTemplate: (
    { __typename?: 'ScriptTemplate' }
    & Pick<ScriptTemplate, 'id' | 'script' | 'index' | 'title'>
  ) }
);

export type CreateScriptTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
}>;


export type CreateScriptTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createScriptTemplate: (
    { __typename?: 'ScriptTemplate' }
    & Pick<ScriptTemplate, 'id' | 'script' | 'title'>
  ) }
);

export type DeleteScriptTemplateMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  templateId: Scalars['UUID'];
}>;


export type DeleteScriptTemplateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteScriptTemplate'>
);

export type CreateScriptExecutionMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type CreateScriptExecutionMutation = (
  { __typename?: 'Mutation' }
  & { createScriptExecution: (
    { __typename?: 'ScriptExecution' }
    & Pick<ScriptExecution, 'id' | 'script' | 'logs' | 'value'>
    & { errors?: Maybe<Array<(
      { __typename?: 'ProgramError' }
      & Pick<ProgramError, 'message'>
      & { startPosition?: Maybe<(
        { __typename?: 'ProgramPosition' }
        & Pick<ProgramPosition, 'offset' | 'line' | 'column'>
      )>, endPosition?: Maybe<(
        { __typename?: 'ProgramPosition' }
        & Pick<ProgramPosition, 'offset' | 'line' | 'column'>
      )> }
    )>> }
  ) }
);

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['UUID'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProject'>
);

export type SetExecutionResultsMutationVariables = Exact<{
  resultType: ResultType;
  rawResult: Scalars['RawExecutionResult'];
  label?: Maybe<Scalars['String']>;
}>;


export type SetExecutionResultsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateCachedExecutionResults'>
);

export type ClearExecutionResultsMutationVariables = Exact<{
  resultType: ResultType;
}>;


export type ClearExecutionResultsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'clearCachedExecutionResults'>
);

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { projectList: (
    { __typename?: 'ProjectList' }
    & { projects?: Maybe<Array<(
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'updatedAt' | 'title'>
      & { contractTemplates?: Maybe<Array<(
        { __typename?: 'ContractTemplate' }
        & Pick<ContractTemplate, 'id' | 'script' | 'title'>
      )>>, transactionTemplates?: Maybe<Array<(
        { __typename?: 'TransactionTemplate' }
        & Pick<TransactionTemplate, 'id' | 'script' | 'title'>
      )>>, scriptTemplates?: Maybe<Array<(
        { __typename?: 'ScriptTemplate' }
        & Pick<ScriptTemplate, 'id' | 'script' | 'title'>
      )>> }
    )>> }
  ) }
);

export type GetProjectQueryVariables = Exact<{
  projectId: Scalars['UUID'];
}>;


export type GetProjectQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'persist' | 'mutable' | 'parentId' | 'updatedAt' | 'seed' | 'title' | 'description' | 'readme'>
    & { accounts?: Maybe<Array<(
      { __typename?: 'Account' }
      & Pick<Account, 'address' | 'deployedContracts' | 'state'>
    )>>, contractTemplates?: Maybe<Array<(
      { __typename?: 'ContractTemplate' }
      & Pick<ContractTemplate, 'id' | 'script' | 'title'>
    )>>, transactionTemplates?: Maybe<Array<(
      { __typename?: 'TransactionTemplate' }
      & Pick<TransactionTemplate, 'id' | 'script' | 'title'>
    )>>, scriptTemplates?: Maybe<Array<(
      { __typename?: 'ScriptTemplate' }
      & Pick<ScriptTemplate, 'id' | 'script' | 'title'>
    )>> }
  ) }
);

export type GetLocalProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocalProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'persist' | 'mutable' | 'parentId' | 'seed' | 'title' | 'description' | 'readme'>
    & { accounts?: Maybe<Array<(
      { __typename?: 'Account' }
      & Pick<Account, 'address' | 'deployedContracts' | 'state'>
    )>>, contractTemplates?: Maybe<Array<(
      { __typename?: 'ContractTemplate' }
      & Pick<ContractTemplate, 'id' | 'script' | 'title'>
    )>>, transactionTemplates?: Maybe<Array<(
      { __typename?: 'TransactionTemplate' }
      & Pick<TransactionTemplate, 'id' | 'script' | 'title'>
    )>>, scriptTemplates?: Maybe<Array<(
      { __typename?: 'ScriptTemplate' }
      & Pick<ScriptTemplate, 'id' | 'script' | 'title'>
    )>> }
  )> }
);

export type GetActiveProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveProjectQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'activeProjectId' | 'activeProject'>
);

export type ExecutionResultDetailsFragment = (
  { __typename?: 'ExecutionResult' }
  & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
);

export type GetCachedExecutionResultsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCachedExecutionResultsQuery = (
  { __typename?: 'Query' }
  & { cachedExecutionResults: Array<Maybe<(
    { __typename?: 'ExecutionResults' }
    & { TRANSACTION?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & ExecutionResultDetailsFragment
    )>>>, SCRIPT?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & ExecutionResultDetailsFragment
    )>>>, CONTRACT?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & ExecutionResultDetailsFragment
    )>>> }
  )>> }
);

export type TxResultsFragment = (
  { __typename?: 'ExecutionResults' }
  & { TRANSACTION?: Maybe<Array<Maybe<(
    { __typename?: 'ExecutionResult' }
    & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
  )>>> }
);

export type ScriptResultsFragment = (
  { __typename?: 'ExecutionResults' }
  & { SCRIPT?: Maybe<Array<Maybe<(
    { __typename?: 'ExecutionResult' }
    & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
  )>>> }
);

export type ContractResultsFragment = (
  { __typename?: 'ExecutionResults' }
  & { CONTRACT?: Maybe<Array<Maybe<(
    { __typename?: 'ExecutionResult' }
    & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
  )>>> }
);

export type GetExecutionResultsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExecutionResultsQuery = (
  { __typename?: 'Query' }
  & { cachedExecutionResults: Array<Maybe<(
    { __typename?: 'ExecutionResults' }
    & { TRANSACTION?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
    )>>>, SCRIPT?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
    )>>>, CONTRACT?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
    )>>> }
  )>> }
);

export type GetResultsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetResultsQuery = (
  { __typename?: 'Query' }
  & { cachedExecutionResults: Array<Maybe<(
    { __typename?: 'ExecutionResults' }
    & { TRANSACTION?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
    )>>>, SCRIPT?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
    )>>>, CONTRACT?: Maybe<Array<Maybe<(
      { __typename?: 'ExecutionResult' }
      & Pick<ExecutionResult, 'timestamp' | 'tag' | 'value' | 'label'>
    )>>> }
  )>> }
);

export const ExecutionResultDetailsFragmentDoc = gql`
    fragment ExecutionResultDetails on ExecutionResult {
  timestamp
  tag
  value
  label
}
    `;
export const TxResultsFragmentDoc = gql`
    fragment txResults on ExecutionResults {
  TRANSACTION {
    timestamp
    tag
    value
    label
  }
}
    `;
export const ScriptResultsFragmentDoc = gql`
    fragment scriptResults on ExecutionResults {
  SCRIPT {
    timestamp
    tag
    value
    label
  }
}
    `;
export const ContractResultsFragmentDoc = gql`
    fragment contractResults on ExecutionResults {
  CONTRACT {
    timestamp
    tag
    value
    label
  }
}
    `;
export const CreateProjectDocument = gql`
    mutation CreateProject($parentId: UUID, $title: String!, $description: String!, $readme: String!, $seed: Int!, $numberOfAccounts: Int!, $transactionTemplates: [NewProjectTransactionTemplate!]!, $scriptTemplates: [NewProjectScriptTemplate!]!, $contractTemplates: [NewProjectContractTemplate!]!) {
  project: createProject(
    input: {parentId: $parentId, numberOfAccounts: $numberOfAccounts, seed: $seed, title: $title, description: $description, readme: $readme, transactionTemplates: $transactionTemplates, scriptTemplates: $scriptTemplates, contractTemplates: $contractTemplates}
  ) {
    id
    persist
    mutable
    parentId
    seed
    title
    description
    readme
    accounts {
      address
      deployedContracts
      state
    }
    transactionTemplates {
      id
      script
      title
    }
    scriptTemplates {
      id
      script
      title
    }
    contractTemplates {
      id
      script
      title
    }
  }
}
    `;
export type CreateProjectMutationFn = ApolloReactCommon.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      readme: // value for 'readme'
 *      seed: // value for 'seed'
 *      numberOfAccounts: // value for 'numberOfAccounts'
 *      transactionTemplates: // value for 'transactionTemplates'
 *      scriptTemplates: // value for 'scriptTemplates'
 *      contractTemplates: // value for 'contractTemplates'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = ApolloReactCommon.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($projectId: UUID!, $title: String!, $description: String!, $readme: String!) {
  updateProject(
    input: {id: $projectId, persist: true, title: $title, description: $description, readme: $readme}
  ) {
    id
    persist
    title
    description
    readme
  }
}
    `;
export type UpdateProjectMutationFn = ApolloReactCommon.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      readme: // value for 'readme'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = ApolloReactCommon.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const SetActiveProjectDocument = gql`
    mutation SetActiveProject($id: Int!) {
  setActiveProjectId(id: $id) @client
}
    `;
export type SetActiveProjectMutationFn = ApolloReactCommon.MutationFunction<SetActiveProjectMutation, SetActiveProjectMutationVariables>;

/**
 * __useSetActiveProjectMutation__
 *
 * To run a mutation, you first call `useSetActiveProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetActiveProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setActiveProjectMutation, { data, loading, error }] = useSetActiveProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSetActiveProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetActiveProjectMutation, SetActiveProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<SetActiveProjectMutation, SetActiveProjectMutationVariables>(SetActiveProjectDocument, baseOptions);
      }
export type SetActiveProjectMutationHookResult = ReturnType<typeof useSetActiveProjectMutation>;
export type SetActiveProjectMutationResult = ApolloReactCommon.MutationResult<SetActiveProjectMutation>;
export type SetActiveProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<SetActiveProjectMutation, SetActiveProjectMutationVariables>;
export const CreateContractTemplateDocument = gql`
    mutation CreateContractTemplate($projectId: UUID!, $script: String!, $title: String!) {
  createContractTemplate(
    input: {projectId: $projectId, script: $script, title: $title}
  ) {
    id
    script
    title
  }
}
    `;
export type CreateContractTemplateMutationFn = ApolloReactCommon.MutationFunction<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>;

/**
 * __useCreateContractTemplateMutation__
 *
 * To run a mutation, you first call `useCreateContractTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContractTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContractTemplateMutation, { data, loading, error }] = useCreateContractTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateContractTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>(CreateContractTemplateDocument, baseOptions);
      }
export type CreateContractTemplateMutationHookResult = ReturnType<typeof useCreateContractTemplateMutation>;
export type CreateContractTemplateMutationResult = ApolloReactCommon.MutationResult<CreateContractTemplateMutation>;
export type CreateContractTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>;
export const UpdateContractTemplateDocument = gql`
    mutation UpdateContractTemplate($projectId: UUID!, $templateId: UUID!, $script: String!, $title: String) {
  updateContractTemplate(
    input: {projectId: $projectId, id: $templateId, script: $script, title: $title}
  ) {
    id
    script
    index
    title
  }
}
    `;
export type UpdateContractTemplateMutationFn = ApolloReactCommon.MutationFunction<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>;

/**
 * __useUpdateContractTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateContractTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContractTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContractTemplateMutation, { data, loading, error }] = useUpdateContractTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      templateId: // value for 'templateId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateContractTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>(UpdateContractTemplateDocument, baseOptions);
      }
export type UpdateContractTemplateMutationHookResult = ReturnType<typeof useUpdateContractTemplateMutation>;
export type UpdateContractTemplateMutationResult = ApolloReactCommon.MutationResult<UpdateContractTemplateMutation>;
export type UpdateContractTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>;
export const DeleteContractTemplateDocument = gql`
    mutation DeleteContractTemplate($projectId: UUID!, $templateId: UUID!) {
  deleteContractTemplate(id: $templateId, projectId: $projectId)
}
    `;
export type DeleteContractTemplateMutationFn = ApolloReactCommon.MutationFunction<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>;

/**
 * __useDeleteContractTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteContractTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContractTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContractTemplateMutation, { data, loading, error }] = useDeleteContractTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      templateId: // value for 'templateId'
 *   },
 * });
 */
export function useDeleteContractTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>(DeleteContractTemplateDocument, baseOptions);
      }
export type DeleteContractTemplateMutationHookResult = ReturnType<typeof useDeleteContractTemplateMutation>;
export type DeleteContractTemplateMutationResult = ApolloReactCommon.MutationResult<DeleteContractTemplateMutation>;
export type DeleteContractTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>;
export const CreateContractDeploymentDocument = gql`
    mutation CreateContractDeployment($projectId: UUID!, $script: String!, $signer: Address!) {
  createContractDeployment(
    input: {projectId: $projectId, script: $script, address: $signer}
  ) {
    id
    script
    errors {
      message
      startPosition {
        offset
        line
        column
      }
      endPosition {
        offset
        line
        column
      }
    }
    logs
    events {
      type
      values
    }
  }
}
    `;
export type CreateContractDeploymentMutationFn = ApolloReactCommon.MutationFunction<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>;

/**
 * __useCreateContractDeploymentMutation__
 *
 * To run a mutation, you first call `useCreateContractDeploymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContractDeploymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContractDeploymentMutation, { data, loading, error }] = useCreateContractDeploymentMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      script: // value for 'script'
 *      signer: // value for 'signer'
 *   },
 * });
 */
export function useCreateContractDeploymentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>(CreateContractDeploymentDocument, baseOptions);
      }
export type CreateContractDeploymentMutationHookResult = ReturnType<typeof useCreateContractDeploymentMutation>;
export type CreateContractDeploymentMutationResult = ApolloReactCommon.MutationResult<CreateContractDeploymentMutation>;
export type CreateContractDeploymentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>;
export const UpdateTransactionTemplateDocument = gql`
    mutation UpdateTransactionTemplate($projectId: UUID!, $templateId: UUID!, $script: String!, $title: String) {
  updateTransactionTemplate(
    input: {projectId: $projectId, id: $templateId, script: $script, title: $title}
  ) {
    id
    script
    index
    title
  }
}
    `;
export type UpdateTransactionTemplateMutationFn = ApolloReactCommon.MutationFunction<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>;

/**
 * __useUpdateTransactionTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionTemplateMutation, { data, loading, error }] = useUpdateTransactionTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      templateId: // value for 'templateId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateTransactionTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>(UpdateTransactionTemplateDocument, baseOptions);
      }
export type UpdateTransactionTemplateMutationHookResult = ReturnType<typeof useUpdateTransactionTemplateMutation>;
export type UpdateTransactionTemplateMutationResult = ApolloReactCommon.MutationResult<UpdateTransactionTemplateMutation>;
export type UpdateTransactionTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>;
export const CreateTransactionTemplateDocument = gql`
    mutation CreateTransactionTemplate($projectId: UUID!, $script: String!, $title: String!) {
  createTransactionTemplate(
    input: {projectId: $projectId, script: $script, title: $title}
  ) {
    id
    script
    title
  }
}
    `;
export type CreateTransactionTemplateMutationFn = ApolloReactCommon.MutationFunction<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>;

/**
 * __useCreateTransactionTemplateMutation__
 *
 * To run a mutation, you first call `useCreateTransactionTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTransactionTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTransactionTemplateMutation, { data, loading, error }] = useCreateTransactionTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateTransactionTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>(CreateTransactionTemplateDocument, baseOptions);
      }
export type CreateTransactionTemplateMutationHookResult = ReturnType<typeof useCreateTransactionTemplateMutation>;
export type CreateTransactionTemplateMutationResult = ApolloReactCommon.MutationResult<CreateTransactionTemplateMutation>;
export type CreateTransactionTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>;
export const DeleteTransactionTemplateDocument = gql`
    mutation DeleteTransactionTemplate($projectId: UUID!, $templateId: UUID!) {
  deleteTransactionTemplate(id: $templateId, projectId: $projectId)
}
    `;
export type DeleteTransactionTemplateMutationFn = ApolloReactCommon.MutationFunction<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>;

/**
 * __useDeleteTransactionTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteTransactionTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTransactionTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTransactionTemplateMutation, { data, loading, error }] = useDeleteTransactionTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      templateId: // value for 'templateId'
 *   },
 * });
 */
export function useDeleteTransactionTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>(DeleteTransactionTemplateDocument, baseOptions);
      }
export type DeleteTransactionTemplateMutationHookResult = ReturnType<typeof useDeleteTransactionTemplateMutation>;
export type DeleteTransactionTemplateMutationResult = ApolloReactCommon.MutationResult<DeleteTransactionTemplateMutation>;
export type DeleteTransactionTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>;
export const CreateTransactionExecutionDocument = gql`
    mutation CreateTransactionExecution($projectId: UUID!, $script: String!, $signers: [Address!], $arguments: [String!]) {
  createTransactionExecution(
    input: {projectId: $projectId, script: $script, signers: $signers, arguments: $arguments}
  ) {
    id
    script
    errors {
      message
      startPosition {
        offset
        line
        column
      }
      endPosition {
        offset
        line
        column
      }
    }
    logs
    events {
      type
      values
    }
  }
}
    `;
export type CreateTransactionExecutionMutationFn = ApolloReactCommon.MutationFunction<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>;

/**
 * __useCreateTransactionExecutionMutation__
 *
 * To run a mutation, you first call `useCreateTransactionExecutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTransactionExecutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTransactionExecutionMutation, { data, loading, error }] = useCreateTransactionExecutionMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      script: // value for 'script'
 *      signers: // value for 'signers'
 *      arguments: // value for 'arguments'
 *   },
 * });
 */
export function useCreateTransactionExecutionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>(CreateTransactionExecutionDocument, baseOptions);
      }
export type CreateTransactionExecutionMutationHookResult = ReturnType<typeof useCreateTransactionExecutionMutation>;
export type CreateTransactionExecutionMutationResult = ApolloReactCommon.MutationResult<CreateTransactionExecutionMutation>;
export type CreateTransactionExecutionMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>;
export const UpdateScripTemplateDocument = gql`
    mutation UpdateScripTemplate($projectId: UUID!, $templateId: UUID!, $script: String!, $title: String) {
  updateScriptTemplate(
    input: {projectId: $projectId, id: $templateId, script: $script, title: $title}
  ) {
    id
    script
    index
    title
  }
}
    `;
export type UpdateScripTemplateMutationFn = ApolloReactCommon.MutationFunction<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>;

/**
 * __useUpdateScripTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateScripTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScripTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScripTemplateMutation, { data, loading, error }] = useUpdateScripTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      templateId: // value for 'templateId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateScripTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>(UpdateScripTemplateDocument, baseOptions);
      }
export type UpdateScripTemplateMutationHookResult = ReturnType<typeof useUpdateScripTemplateMutation>;
export type UpdateScripTemplateMutationResult = ApolloReactCommon.MutationResult<UpdateScripTemplateMutation>;
export type UpdateScripTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>;
export const CreateScriptTemplateDocument = gql`
    mutation CreateScriptTemplate($projectId: UUID!, $script: String!, $title: String!) {
  createScriptTemplate(
    input: {projectId: $projectId, script: $script, title: $title}
  ) {
    id
    script
    title
  }
}
    `;
export type CreateScriptTemplateMutationFn = ApolloReactCommon.MutationFunction<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>;

/**
 * __useCreateScriptTemplateMutation__
 *
 * To run a mutation, you first call `useCreateScriptTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScriptTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScriptTemplateMutation, { data, loading, error }] = useCreateScriptTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateScriptTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>(CreateScriptTemplateDocument, baseOptions);
      }
export type CreateScriptTemplateMutationHookResult = ReturnType<typeof useCreateScriptTemplateMutation>;
export type CreateScriptTemplateMutationResult = ApolloReactCommon.MutationResult<CreateScriptTemplateMutation>;
export type CreateScriptTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>;
export const DeleteScriptTemplateDocument = gql`
    mutation DeleteScriptTemplate($projectId: UUID!, $templateId: UUID!) {
  deleteScriptTemplate(id: $templateId, projectId: $projectId)
}
    `;
export type DeleteScriptTemplateMutationFn = ApolloReactCommon.MutationFunction<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>;

/**
 * __useDeleteScriptTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteScriptTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScriptTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScriptTemplateMutation, { data, loading, error }] = useDeleteScriptTemplateMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      templateId: // value for 'templateId'
 *   },
 * });
 */
export function useDeleteScriptTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>(DeleteScriptTemplateDocument, baseOptions);
      }
export type DeleteScriptTemplateMutationHookResult = ReturnType<typeof useDeleteScriptTemplateMutation>;
export type DeleteScriptTemplateMutationResult = ApolloReactCommon.MutationResult<DeleteScriptTemplateMutation>;
export type DeleteScriptTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>;
export const CreateScriptExecutionDocument = gql`
    mutation CreateScriptExecution($projectId: UUID!, $script: String!, $arguments: [String!]) {
  createScriptExecution(
    input: {projectId: $projectId, script: $script, arguments: $arguments}
  ) {
    id
    script
    errors {
      message
      startPosition {
        offset
        line
        column
      }
      endPosition {
        offset
        line
        column
      }
    }
    logs
    value
  }
}
    `;
export type CreateScriptExecutionMutationFn = ApolloReactCommon.MutationFunction<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>;

/**
 * __useCreateScriptExecutionMutation__
 *
 * To run a mutation, you first call `useCreateScriptExecutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScriptExecutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScriptExecutionMutation, { data, loading, error }] = useCreateScriptExecutionMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      script: // value for 'script'
 *      arguments: // value for 'arguments'
 *   },
 * });
 */
export function useCreateScriptExecutionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>(CreateScriptExecutionDocument, baseOptions);
      }
export type CreateScriptExecutionMutationHookResult = ReturnType<typeof useCreateScriptExecutionMutation>;
export type CreateScriptExecutionMutationResult = ApolloReactCommon.MutationResult<CreateScriptExecutionMutation>;
export type CreateScriptExecutionMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($projectId: UUID!) {
  deleteProject(projectId: $projectId)
}
    `;
export type DeleteProjectMutationFn = ApolloReactCommon.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = ApolloReactCommon.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const SetExecutionResultsDocument = gql`
    mutation SetExecutionResults($resultType: ResultType!, $rawResult: RawExecutionResult!, $label: String) {
  updateCachedExecutionResults(
    resultType: $resultType
    rawResult: $rawResult
    label: $label
  ) @client
}
    `;
export type SetExecutionResultsMutationFn = ApolloReactCommon.MutationFunction<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>;

/**
 * __useSetExecutionResultsMutation__
 *
 * To run a mutation, you first call `useSetExecutionResultsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetExecutionResultsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setExecutionResultsMutation, { data, loading, error }] = useSetExecutionResultsMutation({
 *   variables: {
 *      resultType: // value for 'resultType'
 *      rawResult: // value for 'rawResult'
 *      label: // value for 'label'
 *   },
 * });
 */
export function useSetExecutionResultsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>) {
        return ApolloReactHooks.useMutation<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>(SetExecutionResultsDocument, baseOptions);
      }
export type SetExecutionResultsMutationHookResult = ReturnType<typeof useSetExecutionResultsMutation>;
export type SetExecutionResultsMutationResult = ApolloReactCommon.MutationResult<SetExecutionResultsMutation>;
export type SetExecutionResultsMutationOptions = ApolloReactCommon.BaseMutationOptions<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>;
export const ClearExecutionResultsDocument = gql`
    mutation ClearExecutionResults($resultType: ResultType!) {
  clearCachedExecutionResults(resultType: $resultType) @client
}
    `;
export type ClearExecutionResultsMutationFn = ApolloReactCommon.MutationFunction<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>;

/**
 * __useClearExecutionResultsMutation__
 *
 * To run a mutation, you first call `useClearExecutionResultsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearExecutionResultsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearExecutionResultsMutation, { data, loading, error }] = useClearExecutionResultsMutation({
 *   variables: {
 *      resultType: // value for 'resultType'
 *   },
 * });
 */
export function useClearExecutionResultsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>) {
        return ApolloReactHooks.useMutation<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>(ClearExecutionResultsDocument, baseOptions);
      }
export type ClearExecutionResultsMutationHookResult = ReturnType<typeof useClearExecutionResultsMutation>;
export type ClearExecutionResultsMutationResult = ApolloReactCommon.MutationResult<ClearExecutionResultsMutation>;
export type ClearExecutionResultsMutationOptions = ApolloReactCommon.BaseMutationOptions<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>;
export const GetProjectsDocument = gql`
    query GetProjects {
  projectList {
    projects {
      id
      updatedAt
      title
      contractTemplates {
        id
        script
        title
      }
      transactionTemplates {
        id
        script
        title
      }
      scriptTemplates {
        id
        script
        title
      }
    }
  }
}
    `;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
      }
export function useGetProjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = ApolloReactCommon.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectDocument = gql`
    query GetProject($projectId: UUID!) {
  project(id: $projectId) {
    id
    persist
    mutable
    parentId
    updatedAt
    seed
    title
    description
    readme
    accounts {
      address
      deployedContracts
      state
    }
    contractTemplates {
      id
      script
      title
    }
    transactionTemplates {
      id
      script
      title
    }
    scriptTemplates {
      id
      script
      title
    }
  }
}
    `;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
      }
export function useGetProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = ApolloReactCommon.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetLocalProjectDocument = gql`
    query GetLocalProject {
  project: localProject @client {
    id
    persist
    mutable
    parentId
    seed
    title
    description
    readme
    accounts {
      address
      deployedContracts
      state
    }
    contractTemplates {
      id
      script
      title
    }
    transactionTemplates {
      id
      script
      title
    }
    scriptTemplates {
      id
      script
      title
    }
  }
}
    `;

/**
 * __useGetLocalProjectQuery__
 *
 * To run a query within a React component, call `useGetLocalProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocalProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocalProjectQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLocalProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLocalProjectQuery, GetLocalProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<GetLocalProjectQuery, GetLocalProjectQueryVariables>(GetLocalProjectDocument, baseOptions);
      }
export function useGetLocalProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLocalProjectQuery, GetLocalProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetLocalProjectQuery, GetLocalProjectQueryVariables>(GetLocalProjectDocument, baseOptions);
        }
export type GetLocalProjectQueryHookResult = ReturnType<typeof useGetLocalProjectQuery>;
export type GetLocalProjectLazyQueryHookResult = ReturnType<typeof useGetLocalProjectLazyQuery>;
export type GetLocalProjectQueryResult = ApolloReactCommon.QueryResult<GetLocalProjectQuery, GetLocalProjectQueryVariables>;
export const GetActiveProjectDocument = gql`
    query GetActiveProject {
  activeProjectId @client
  activeProject @client
}
    `;

/**
 * __useGetActiveProjectQuery__
 *
 * To run a query within a React component, call `useGetActiveProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveProjectQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActiveProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetActiveProjectQuery, GetActiveProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<GetActiveProjectQuery, GetActiveProjectQueryVariables>(GetActiveProjectDocument, baseOptions);
      }
export function useGetActiveProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetActiveProjectQuery, GetActiveProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetActiveProjectQuery, GetActiveProjectQueryVariables>(GetActiveProjectDocument, baseOptions);
        }
export type GetActiveProjectQueryHookResult = ReturnType<typeof useGetActiveProjectQuery>;
export type GetActiveProjectLazyQueryHookResult = ReturnType<typeof useGetActiveProjectLazyQuery>;
export type GetActiveProjectQueryResult = ApolloReactCommon.QueryResult<GetActiveProjectQuery, GetActiveProjectQueryVariables>;
export const GetCachedExecutionResultsDocument = gql`
    query GetCachedExecutionResults {
  cachedExecutionResults @client {
    TRANSACTION {
      ...ExecutionResultDetails
    }
    SCRIPT {
      ...ExecutionResultDetails
    }
    CONTRACT {
      ...ExecutionResultDetails
    }
  }
}
    ${ExecutionResultDetailsFragmentDoc}`;

/**
 * __useGetCachedExecutionResultsQuery__
 *
 * To run a query within a React component, call `useGetCachedExecutionResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCachedExecutionResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCachedExecutionResultsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCachedExecutionResultsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>(GetCachedExecutionResultsDocument, baseOptions);
      }
export function useGetCachedExecutionResultsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>(GetCachedExecutionResultsDocument, baseOptions);
        }
export type GetCachedExecutionResultsQueryHookResult = ReturnType<typeof useGetCachedExecutionResultsQuery>;
export type GetCachedExecutionResultsLazyQueryHookResult = ReturnType<typeof useGetCachedExecutionResultsLazyQuery>;
export type GetCachedExecutionResultsQueryResult = ApolloReactCommon.QueryResult<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>;
export const GetExecutionResultsDocument = gql`
    query GetExecutionResults {
  cachedExecutionResults {
    TRANSACTION {
      timestamp
      tag
      value
      label
    }
    SCRIPT {
      timestamp
      tag
      value
      label
    }
    CONTRACT {
      timestamp
      tag
      value
      label
    }
  }
}
    `;

/**
 * __useGetExecutionResultsQuery__
 *
 * To run a query within a React component, call `useGetExecutionResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExecutionResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExecutionResultsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExecutionResultsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>(GetExecutionResultsDocument, baseOptions);
      }
export function useGetExecutionResultsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>(GetExecutionResultsDocument, baseOptions);
        }
export type GetExecutionResultsQueryHookResult = ReturnType<typeof useGetExecutionResultsQuery>;
export type GetExecutionResultsLazyQueryHookResult = ReturnType<typeof useGetExecutionResultsLazyQuery>;
export type GetExecutionResultsQueryResult = ApolloReactCommon.QueryResult<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>;
export const GetResultsDocument = gql`
    query GetResults {
  cachedExecutionResults {
    TRANSACTION {
      timestamp
      tag
      value
      label
    }
    SCRIPT {
      timestamp
      tag
      value
      label
    }
    CONTRACT {
      timestamp
      tag
      value
      label
    }
  }
}
    `;

/**
 * __useGetResultsQuery__
 *
 * To run a query within a React component, call `useGetResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResultsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetResultsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetResultsQuery, GetResultsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetResultsQuery, GetResultsQueryVariables>(GetResultsDocument, baseOptions);
      }
export function useGetResultsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetResultsQuery, GetResultsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetResultsQuery, GetResultsQueryVariables>(GetResultsDocument, baseOptions);
        }
export type GetResultsQueryHookResult = ReturnType<typeof useGetResultsQuery>;
export type GetResultsLazyQueryHookResult = ReturnType<typeof useGetResultsLazyQuery>;
export type GetResultsQueryResult = ApolloReactCommon.QueryResult<GetResultsQuery, GetResultsQueryVariables>;

      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": []
  }
};
      export default result;
    