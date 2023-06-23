import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
/** This file is mostly generated, see package.json for command.
 * Consolidating React Apollo libs into single Apollo object, 
 * The generator expectas all hooks and common methods are in an Apollo object.
 * Doing this will make it easier next time generator is used. 
 * */
const Apollo = { ...ApolloReactHooks, ...ApolloReactCommon };
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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
  address: Scalars['Address'];
  arguments?: Maybe<Array<Scalars['String']>>;
  blockHeight: Scalars['Int'];
  errors?: Maybe<Array<ProgramError>>;
  events?: Maybe<Array<Event>>;
  id: Scalars['UUID'];
  logs?: Maybe<Array<Scalars['String']>>;
  script: Scalars['String'];
  title: Scalars['String'];
};

export type ContractTemplate = {
  __typename?: 'ContractTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  script: Scalars['String'];
  title: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  type: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type ExecutionResult = {
  __typename?: 'ExecutionResult';
  label?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['ExecutionResultValue']>;
};

export type ExecutionResultInput = {
  data?: Maybe<Scalars['RawExecutionResult']>;
};


export type ExecutionResults = {
  __typename?: 'ExecutionResults';
  CONTRACT?: Maybe<Array<Maybe<ExecutionResult>>>;
  SCRIPT?: Maybe<Array<Maybe<ExecutionResult>>>;
  TRANSACTION?: Maybe<Array<Maybe<ExecutionResult>>>;
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
  resetProjectState: Scalars['UUID'];
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


export type MutationResetProjectStateArgs = {
  projectId: Scalars['UUID'];
};


export type MutationSetActiveProjectIdArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type MutationUpdateCachedExecutionResultsArgs = {
  label?: Maybe<Scalars['String']>;
  rawResult: Scalars['RawExecutionResult'];
  resultType: ResultType;
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
  address: Scalars['Address'];
  arguments?: Maybe<Array<Scalars['String']>>;
  projectId: Scalars['UUID'];
  script: Scalars['String'];
};

export type NewContractTemplate = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewFile = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewProject = {
  contractTemplates?: Maybe<Array<NewProjectContractTemplate>>;
  description: Scalars['String'];
  numberOfAccounts: Scalars['Int'];
  parentId?: Maybe<Scalars['UUID']>;
  readme: Scalars['String'];
  scriptTemplates?: Maybe<Array<NewProjectScriptTemplate>>;
  seed: Scalars['Int'];
  title: Scalars['String'];
  transactionTemplates?: Maybe<Array<NewProjectTransactionTemplate>>;
};

export type NewProjectContractTemplate = {
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewProjectFile = {
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewProjectScriptTemplate = {
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewProjectTransactionTemplate = {
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewScriptExecution = {
  arguments?: Maybe<Array<Scalars['String']>>;
  projectId: Scalars['UUID'];
  script: Scalars['String'];
};

export type NewScriptTemplate = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
};

export type NewTransactionExecution = {
  arguments?: Maybe<Array<Scalars['String']>>;
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  signers?: Maybe<Array<Scalars['Address']>>;
};

export type NewTransactionTemplate = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  title: Scalars['String'];
};

export type PlaygroundInfo = {
  __typename?: 'PlaygroundInfo';
  apiVersion: Scalars['Version'];
  cadenceVersion: Scalars['Version'];
  emulatorVersion: Scalars['Version'];
};

export type ProgramError = {
  __typename?: 'ProgramError';
  endPosition?: Maybe<ProgramPosition>;
  message: Scalars['String'];
  startPosition?: Maybe<ProgramPosition>;
};

export type ProgramPosition = {
  __typename?: 'ProgramPosition';
  column: Scalars['Int'];
  line: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Project = {
  __typename?: 'Project';
  accounts?: Maybe<Array<Account>>;
  contractDeployments?: Maybe<Array<ContractDeployment>>;
  contractTemplates?: Maybe<Array<ContractTemplate>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  mutable?: Maybe<Scalars['Boolean']>;
  numberOfAccounts: Scalars['Int'];
  parentId?: Maybe<Scalars['UUID']>;
  persist?: Maybe<Scalars['Boolean']>;
  publicId: Scalars['UUID'];
  readme?: Maybe<Scalars['String']>;
  scriptExecutions?: Maybe<Array<ScriptExecution>>;
  scriptTemplates?: Maybe<Array<ScriptTemplate>>;
  seed: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  transactionExecutions?: Maybe<Array<TransactionExecution>>;
  transactionTemplates?: Maybe<Array<TransactionTemplate>>;
  updatedAt: Scalars['String'];
  version: Scalars['Version'];
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
  flowJson: Scalars['String'];
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


export type QueryFlowJsonArgs = {
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
  Contract = 'CONTRACT',
  Script = 'SCRIPT',
  Transaction = 'TRANSACTION'
}

export type ScriptExecution = {
  __typename?: 'ScriptExecution';
  arguments?: Maybe<Array<Scalars['String']>>;
  errors?: Maybe<Array<ProgramError>>;
  id: Scalars['UUID'];
  logs: Array<Scalars['String']>;
  script: Scalars['String'];
  value: Scalars['String'];
};

export type ScriptTemplate = {
  __typename?: 'ScriptTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  script: Scalars['String'];
  title: Scalars['String'];
};

export type TransactionExecution = {
  __typename?: 'TransactionExecution';
  arguments?: Maybe<Array<Scalars['String']>>;
  errors?: Maybe<Array<ProgramError>>;
  events: Array<Maybe<Event>>;
  id: Scalars['UUID'];
  logs: Array<Scalars['String']>;
  script: Scalars['String'];
  signers: Array<Scalars['Address']>;
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
  script: Scalars['String'];
  title: Scalars['String'];
};


export type UpdateContractTemplate = {
  id: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  projectId: Scalars['UUID'];
  script?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateFile = {
  id: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  projectId: Scalars['UUID'];
  script?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateProject = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  persist?: Maybe<Scalars['Boolean']>;
  readme?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateScriptTemplate = {
  id: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  projectId: Scalars['UUID'];
  script?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateTransactionTemplate = {
  id: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  projectId: Scalars['UUID'];
  script?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
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
  arguments?: Maybe<Array<Scalars['String']> | Scalars['String']>;
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

export type ResetProjectMutationVariables = Exact<{
  projectId: Scalars['UUID'];
}>;


export type ResetProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetProjectState'>
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
        & Pick<ContractTemplate, 'id' | 'script' | 'title' | 'index'>
      )>>, transactionTemplates?: Maybe<Array<(
        { __typename?: 'TransactionTemplate' }
        & Pick<TransactionTemplate, 'id' | 'script' | 'title' | 'index'>
      )>>, scriptTemplates?: Maybe<Array<(
        { __typename?: 'ScriptTemplate' }
        & Pick<ScriptTemplate, 'id' | 'script' | 'title' | 'index'>
      )>>, contractDeployments?: Maybe<Array<(
        { __typename?: 'ContractDeployment' }
        & Pick<ContractDeployment, 'id' | 'script' | 'title' | 'address' | 'blockHeight'>
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
      & Pick<ContractTemplate, 'id' | 'script' | 'title' | 'index'>
    )>>, transactionTemplates?: Maybe<Array<(
      { __typename?: 'TransactionTemplate' }
      & Pick<TransactionTemplate, 'id' | 'script' | 'title' | 'index'>
    )>>, scriptTemplates?: Maybe<Array<(
      { __typename?: 'ScriptTemplate' }
      & Pick<ScriptTemplate, 'id' | 'script' | 'title' | 'index'>
    )>>, contractDeployments?: Maybe<Array<(
      { __typename?: 'ContractDeployment' }
      & Pick<ContractDeployment, 'id' | 'script' | 'title' | 'address' | 'blockHeight'>
    )>>, transactionExecutions?: Maybe<Array<(
      { __typename?: 'TransactionExecution' }
      & Pick<TransactionExecution, 'id' | 'script' | 'arguments' | 'signers' | 'logs'>
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
      & Pick<ContractTemplate, 'id' | 'script' | 'title' | 'index'>
    )>>, transactionTemplates?: Maybe<Array<(
      { __typename?: 'TransactionTemplate' }
      & Pick<TransactionTemplate, 'id' | 'script' | 'title' | 'index'>
    )>>, scriptTemplates?: Maybe<Array<(
      { __typename?: 'ScriptTemplate' }
      & Pick<ScriptTemplate, 'id' | 'script' | 'title' | 'index'>
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

export type GetPlaygroundInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlaygroundInfoQuery = (
  { __typename?: 'Query' }
  & { playgroundInfo: (
    { __typename?: 'PlaygroundInfo' }
    & Pick<PlaygroundInfo, 'apiVersion' | 'cadenceVersion' | 'emulatorVersion'>
  ) }
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
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

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
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
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
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

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
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const SetActiveProjectDocument = gql`
    mutation SetActiveProject($id: Int!) {
  setActiveProjectId(id: $id) @client
}
    `;
export type SetActiveProjectMutationFn = Apollo.MutationFunction<SetActiveProjectMutation, SetActiveProjectMutationVariables>;

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
export function useSetActiveProjectMutation(baseOptions?: Apollo.MutationHookOptions<SetActiveProjectMutation, SetActiveProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetActiveProjectMutation, SetActiveProjectMutationVariables>(SetActiveProjectDocument, options);
      }
export type SetActiveProjectMutationHookResult = ReturnType<typeof useSetActiveProjectMutation>;
export type SetActiveProjectMutationResult = Apollo.MutationResult<SetActiveProjectMutation>;
export type SetActiveProjectMutationOptions = Apollo.BaseMutationOptions<SetActiveProjectMutation, SetActiveProjectMutationVariables>;
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
export type CreateContractTemplateMutationFn = Apollo.MutationFunction<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>;

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
export function useCreateContractTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>(CreateContractTemplateDocument, options);
      }
export type CreateContractTemplateMutationHookResult = ReturnType<typeof useCreateContractTemplateMutation>;
export type CreateContractTemplateMutationResult = Apollo.MutationResult<CreateContractTemplateMutation>;
export type CreateContractTemplateMutationOptions = Apollo.BaseMutationOptions<CreateContractTemplateMutation, CreateContractTemplateMutationVariables>;
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
export type UpdateContractTemplateMutationFn = Apollo.MutationFunction<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>;

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
export function useUpdateContractTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>(UpdateContractTemplateDocument, options);
      }
export type UpdateContractTemplateMutationHookResult = ReturnType<typeof useUpdateContractTemplateMutation>;
export type UpdateContractTemplateMutationResult = Apollo.MutationResult<UpdateContractTemplateMutation>;
export type UpdateContractTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateContractTemplateMutation, UpdateContractTemplateMutationVariables>;
export const DeleteContractTemplateDocument = gql`
    mutation DeleteContractTemplate($projectId: UUID!, $templateId: UUID!) {
  deleteContractTemplate(id: $templateId, projectId: $projectId)
}
    `;
export type DeleteContractTemplateMutationFn = Apollo.MutationFunction<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>;

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
export function useDeleteContractTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>(DeleteContractTemplateDocument, options);
      }
export type DeleteContractTemplateMutationHookResult = ReturnType<typeof useDeleteContractTemplateMutation>;
export type DeleteContractTemplateMutationResult = Apollo.MutationResult<DeleteContractTemplateMutation>;
export type DeleteContractTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteContractTemplateMutation, DeleteContractTemplateMutationVariables>;
export const CreateContractDeploymentDocument = gql`
    mutation CreateContractDeployment($projectId: UUID!, $script: String!, $signer: Address!, $arguments: [String!]) {
  createContractDeployment(
    input: {projectId: $projectId, script: $script, address: $signer, arguments: $arguments}
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
export type CreateContractDeploymentMutationFn = Apollo.MutationFunction<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>;

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
 *      arguments: // value for 'arguments'
 *   },
 * });
 */
export function useCreateContractDeploymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>(CreateContractDeploymentDocument, options);
      }
export type CreateContractDeploymentMutationHookResult = ReturnType<typeof useCreateContractDeploymentMutation>;
export type CreateContractDeploymentMutationResult = Apollo.MutationResult<CreateContractDeploymentMutation>;
export type CreateContractDeploymentMutationOptions = Apollo.BaseMutationOptions<CreateContractDeploymentMutation, CreateContractDeploymentMutationVariables>;
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
export type UpdateTransactionTemplateMutationFn = Apollo.MutationFunction<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>;

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
export function useUpdateTransactionTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>(UpdateTransactionTemplateDocument, options);
      }
export type UpdateTransactionTemplateMutationHookResult = ReturnType<typeof useUpdateTransactionTemplateMutation>;
export type UpdateTransactionTemplateMutationResult = Apollo.MutationResult<UpdateTransactionTemplateMutation>;
export type UpdateTransactionTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionTemplateMutation, UpdateTransactionTemplateMutationVariables>;
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
export type CreateTransactionTemplateMutationFn = Apollo.MutationFunction<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>;

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
export function useCreateTransactionTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>(CreateTransactionTemplateDocument, options);
      }
export type CreateTransactionTemplateMutationHookResult = ReturnType<typeof useCreateTransactionTemplateMutation>;
export type CreateTransactionTemplateMutationResult = Apollo.MutationResult<CreateTransactionTemplateMutation>;
export type CreateTransactionTemplateMutationOptions = Apollo.BaseMutationOptions<CreateTransactionTemplateMutation, CreateTransactionTemplateMutationVariables>;
export const DeleteTransactionTemplateDocument = gql`
    mutation DeleteTransactionTemplate($projectId: UUID!, $templateId: UUID!) {
  deleteTransactionTemplate(id: $templateId, projectId: $projectId)
}
    `;
export type DeleteTransactionTemplateMutationFn = Apollo.MutationFunction<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>;

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
export function useDeleteTransactionTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>(DeleteTransactionTemplateDocument, options);
      }
export type DeleteTransactionTemplateMutationHookResult = ReturnType<typeof useDeleteTransactionTemplateMutation>;
export type DeleteTransactionTemplateMutationResult = Apollo.MutationResult<DeleteTransactionTemplateMutation>;
export type DeleteTransactionTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteTransactionTemplateMutation, DeleteTransactionTemplateMutationVariables>;
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
export type CreateTransactionExecutionMutationFn = Apollo.MutationFunction<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>;

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
export function useCreateTransactionExecutionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>(CreateTransactionExecutionDocument, options);
      }
export type CreateTransactionExecutionMutationHookResult = ReturnType<typeof useCreateTransactionExecutionMutation>;
export type CreateTransactionExecutionMutationResult = Apollo.MutationResult<CreateTransactionExecutionMutation>;
export type CreateTransactionExecutionMutationOptions = Apollo.BaseMutationOptions<CreateTransactionExecutionMutation, CreateTransactionExecutionMutationVariables>;
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
export type UpdateScripTemplateMutationFn = Apollo.MutationFunction<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>;

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
export function useUpdateScripTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>(UpdateScripTemplateDocument, options);
      }
export type UpdateScripTemplateMutationHookResult = ReturnType<typeof useUpdateScripTemplateMutation>;
export type UpdateScripTemplateMutationResult = Apollo.MutationResult<UpdateScripTemplateMutation>;
export type UpdateScripTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateScripTemplateMutation, UpdateScripTemplateMutationVariables>;
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
export type CreateScriptTemplateMutationFn = Apollo.MutationFunction<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>;

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
export function useCreateScriptTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>(CreateScriptTemplateDocument, options);
      }
export type CreateScriptTemplateMutationHookResult = ReturnType<typeof useCreateScriptTemplateMutation>;
export type CreateScriptTemplateMutationResult = Apollo.MutationResult<CreateScriptTemplateMutation>;
export type CreateScriptTemplateMutationOptions = Apollo.BaseMutationOptions<CreateScriptTemplateMutation, CreateScriptTemplateMutationVariables>;
export const DeleteScriptTemplateDocument = gql`
    mutation DeleteScriptTemplate($projectId: UUID!, $templateId: UUID!) {
  deleteScriptTemplate(id: $templateId, projectId: $projectId)
}
    `;
export type DeleteScriptTemplateMutationFn = Apollo.MutationFunction<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>;

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
export function useDeleteScriptTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>(DeleteScriptTemplateDocument, options);
      }
export type DeleteScriptTemplateMutationHookResult = ReturnType<typeof useDeleteScriptTemplateMutation>;
export type DeleteScriptTemplateMutationResult = Apollo.MutationResult<DeleteScriptTemplateMutation>;
export type DeleteScriptTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteScriptTemplateMutation, DeleteScriptTemplateMutationVariables>;
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
export type CreateScriptExecutionMutationFn = Apollo.MutationFunction<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>;

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
export function useCreateScriptExecutionMutation(baseOptions?: Apollo.MutationHookOptions<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>(CreateScriptExecutionDocument, options);
      }
export type CreateScriptExecutionMutationHookResult = ReturnType<typeof useCreateScriptExecutionMutation>;
export type CreateScriptExecutionMutationResult = Apollo.MutationResult<CreateScriptExecutionMutation>;
export type CreateScriptExecutionMutationOptions = Apollo.BaseMutationOptions<CreateScriptExecutionMutation, CreateScriptExecutionMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($projectId: UUID!) {
  deleteProject(projectId: $projectId)
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

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
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const ResetProjectDocument = gql`
    mutation ResetProject($projectId: UUID!) {
  resetProjectState(projectId: $projectId)
}
    `;
export type ResetProjectMutationFn = Apollo.MutationFunction<ResetProjectMutation, ResetProjectMutationVariables>;

/**
 * __useResetProjectMutation__
 *
 * To run a mutation, you first call `useResetProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetProjectMutation, { data, loading, error }] = useResetProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useResetProjectMutation(baseOptions?: Apollo.MutationHookOptions<ResetProjectMutation, ResetProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetProjectMutation, ResetProjectMutationVariables>(ResetProjectDocument, options);
      }
export type ResetProjectMutationHookResult = ReturnType<typeof useResetProjectMutation>;
export type ResetProjectMutationResult = Apollo.MutationResult<ResetProjectMutation>;
export type ResetProjectMutationOptions = Apollo.BaseMutationOptions<ResetProjectMutation, ResetProjectMutationVariables>;
export const SetExecutionResultsDocument = gql`
    mutation SetExecutionResults($resultType: ResultType!, $rawResult: RawExecutionResult!, $label: String) {
  updateCachedExecutionResults(
    resultType: $resultType
    rawResult: $rawResult
    label: $label
  ) @client
}
    `;
export type SetExecutionResultsMutationFn = Apollo.MutationFunction<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>;

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
export function useSetExecutionResultsMutation(baseOptions?: Apollo.MutationHookOptions<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>(SetExecutionResultsDocument, options);
      }
export type SetExecutionResultsMutationHookResult = ReturnType<typeof useSetExecutionResultsMutation>;
export type SetExecutionResultsMutationResult = Apollo.MutationResult<SetExecutionResultsMutation>;
export type SetExecutionResultsMutationOptions = Apollo.BaseMutationOptions<SetExecutionResultsMutation, SetExecutionResultsMutationVariables>;
export const ClearExecutionResultsDocument = gql`
    mutation ClearExecutionResults($resultType: ResultType!) {
  clearCachedExecutionResults(resultType: $resultType) @client
}
    `;
export type ClearExecutionResultsMutationFn = Apollo.MutationFunction<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>;

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
export function useClearExecutionResultsMutation(baseOptions?: Apollo.MutationHookOptions<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>(ClearExecutionResultsDocument, options);
      }
export type ClearExecutionResultsMutationHookResult = ReturnType<typeof useClearExecutionResultsMutation>;
export type ClearExecutionResultsMutationResult = Apollo.MutationResult<ClearExecutionResultsMutation>;
export type ClearExecutionResultsMutationOptions = Apollo.BaseMutationOptions<ClearExecutionResultsMutation, ClearExecutionResultsMutationVariables>;
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
        index
      }
      transactionTemplates {
        id
        script
        title
        index
      }
      scriptTemplates {
        id
        script
        title
        index
      }
      contractDeployments {
        id
        script
        title
        address
        blockHeight
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
export function useGetProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
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
      index
    }
    transactionTemplates {
      id
      script
      title
      index
    }
    scriptTemplates {
      id
      script
      title
      index
    }
    contractDeployments {
      id
      script
      title
      address
      blockHeight
    }
    transactionExecutions {
      id
      script
      arguments
      signers
      logs
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
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
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
      index
    }
    transactionTemplates {
      id
      script
      title
      index
    }
    scriptTemplates {
      id
      script
      title
      index
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
export function useGetLocalProjectQuery(baseOptions?: Apollo.QueryHookOptions<GetLocalProjectQuery, GetLocalProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocalProjectQuery, GetLocalProjectQueryVariables>(GetLocalProjectDocument, options);
      }
export function useGetLocalProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocalProjectQuery, GetLocalProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocalProjectQuery, GetLocalProjectQueryVariables>(GetLocalProjectDocument, options);
        }
export type GetLocalProjectQueryHookResult = ReturnType<typeof useGetLocalProjectQuery>;
export type GetLocalProjectLazyQueryHookResult = ReturnType<typeof useGetLocalProjectLazyQuery>;
export type GetLocalProjectQueryResult = Apollo.QueryResult<GetLocalProjectQuery, GetLocalProjectQueryVariables>;
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
export function useGetActiveProjectQuery(baseOptions?: Apollo.QueryHookOptions<GetActiveProjectQuery, GetActiveProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveProjectQuery, GetActiveProjectQueryVariables>(GetActiveProjectDocument, options);
      }
export function useGetActiveProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveProjectQuery, GetActiveProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveProjectQuery, GetActiveProjectQueryVariables>(GetActiveProjectDocument, options);
        }
export type GetActiveProjectQueryHookResult = ReturnType<typeof useGetActiveProjectQuery>;
export type GetActiveProjectLazyQueryHookResult = ReturnType<typeof useGetActiveProjectLazyQuery>;
export type GetActiveProjectQueryResult = Apollo.QueryResult<GetActiveProjectQuery, GetActiveProjectQueryVariables>;
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
export function useGetCachedExecutionResultsQuery(baseOptions?: Apollo.QueryHookOptions<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>(GetCachedExecutionResultsDocument, options);
      }
export function useGetCachedExecutionResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>(GetCachedExecutionResultsDocument, options);
        }
export type GetCachedExecutionResultsQueryHookResult = ReturnType<typeof useGetCachedExecutionResultsQuery>;
export type GetCachedExecutionResultsLazyQueryHookResult = ReturnType<typeof useGetCachedExecutionResultsLazyQuery>;
export type GetCachedExecutionResultsQueryResult = Apollo.QueryResult<GetCachedExecutionResultsQuery, GetCachedExecutionResultsQueryVariables>;
export const GetPlaygroundInfoDocument = gql`
    query GetPlaygroundInfo {
  playgroundInfo {
    apiVersion
    cadenceVersion
    emulatorVersion
  }
}
    `;

/**
 * __useGetPlaygroundInfoQuery__
 *
 * To run a query within a React component, call `useGetPlaygroundInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaygroundInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaygroundInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlaygroundInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetPlaygroundInfoQuery, GetPlaygroundInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlaygroundInfoQuery, GetPlaygroundInfoQueryVariables>(GetPlaygroundInfoDocument, options);
      }
export function useGetPlaygroundInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlaygroundInfoQuery, GetPlaygroundInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlaygroundInfoQuery, GetPlaygroundInfoQueryVariables>(GetPlaygroundInfoDocument, options);
        }
export type GetPlaygroundInfoQueryHookResult = ReturnType<typeof useGetPlaygroundInfoQuery>;
export type GetPlaygroundInfoLazyQueryHookResult = ReturnType<typeof useGetPlaygroundInfoLazyQuery>;
export type GetPlaygroundInfoQueryResult = Apollo.QueryResult<GetPlaygroundInfoQuery, GetPlaygroundInfoQueryVariables>;
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
export function useGetExecutionResultsQuery(baseOptions?: Apollo.QueryHookOptions<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>(GetExecutionResultsDocument, options);
      }
export function useGetExecutionResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>(GetExecutionResultsDocument, options);
        }
export type GetExecutionResultsQueryHookResult = ReturnType<typeof useGetExecutionResultsQuery>;
export type GetExecutionResultsLazyQueryHookResult = ReturnType<typeof useGetExecutionResultsLazyQuery>;
export type GetExecutionResultsQueryResult = Apollo.QueryResult<GetExecutionResultsQuery, GetExecutionResultsQueryVariables>;
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
export function useGetResultsQuery(baseOptions?: Apollo.QueryHookOptions<GetResultsQuery, GetResultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetResultsQuery, GetResultsQueryVariables>(GetResultsDocument, options);
      }
export function useGetResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetResultsQuery, GetResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetResultsQuery, GetResultsQueryVariables>(GetResultsDocument, options);
        }
export type GetResultsQueryHookResult = ReturnType<typeof useGetResultsQuery>;
export type GetResultsLazyQueryHookResult = ReturnType<typeof useGetResultsLazyQuery>;
export type GetResultsQueryResult = Apollo.QueryResult<GetResultsQuery, GetResultsQueryVariables>;

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
    