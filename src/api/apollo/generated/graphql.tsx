import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Address: any;
  Version: any;
  UUID: any;
  ExecutionResultValue: any;
  RawExecutionResult: any;
};

export type NewTransactionExecution = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  signers?: Maybe<Array<Scalars['Address']>>;
  arguments?: Maybe<Array<Scalars['String']>>;
};

export type TransactionTemplate = {
  __typename?: 'TransactionTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewProjectTransactionTemplate = {
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewContract = {
  projectId: Scalars['UUID'];
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};



export type Event = {
  __typename?: 'Event';
  type: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type UpdateTransactionTemplate = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
};

export type NewScriptTemplate = {
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type ProgramError = {
  __typename?: 'ProgramError';
  message: Scalars['String'];
  startPosition?: Maybe<ProgramPosition>;
  endPosition?: Maybe<ProgramPosition>;
};

export type TransactionExecution = {
  __typename?: 'TransactionExecution';
  id: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']>>;
  signers: Array<Account>;
  errors?: Maybe<Array<ProgramError>>;
  events: Array<Maybe<Event>>;
  logs: Array<Scalars['String']>;
};

export type NewProjectContract = {
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type NewProjectScriptTemplate = {
  title: Scalars['String'];
  script: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['UUID'];
  publicId: Scalars['UUID'];
  parentId?: Maybe<Scalars['UUID']>;
  title: Scalars['String'];
  seed: Scalars['Int'];
  version: Scalars['Version'];
  persist?: Maybe<Scalars['Boolean']>;
  mutable?: Maybe<Scalars['Boolean']>;
  accounts?: Maybe<Array<Account>>;
  contracts?: Maybe<Array<Contract>>;
  transactionTemplates?: Maybe<Array<TransactionTemplate>>;
  transactionExecutions?: Maybe<Array<TransactionExecution>>;
  scriptTemplates?: Maybe<Array<ScriptTemplate>>;
  scriptExecutions?: Maybe<Array<ScriptExecution>>;
};

export type UpdateAccount = {
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
  contractId?: Maybe<Scalars['UUID']>;
  draftCode?: Maybe<Scalars['String']>;
  deployedCode?: Maybe<Scalars['String']>;
};

export type NewScriptExecution = {
  projectId: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']>>;
};

export type PlaygroundInfo = {
  __typename?: 'PlaygroundInfo';
  apiVersion: Scalars['Version'];
  cadenceVersion: Scalars['Version'];
};

export type Contract = {
  __typename?: 'Contract';
  id: Scalars['UUID'];
  accountId?: Maybe<Scalars['UUID']>;
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
  deployedScript?: Maybe<Scalars['String']>;
};

export type ProgramPosition = {
  __typename?: 'ProgramPosition';
  offset: Scalars['Int'];
  line: Scalars['Int'];
  column: Scalars['Int'];
};

export type UpdateContract = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
  deployedScript?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  clearCachedExecutionResults?: Maybe<Scalars['Boolean']>;
  createContract: Contract;
  createProject: Project;
  createScriptExecution: ScriptExecution;
  createScriptTemplate: ScriptTemplate;
  createTransactionExecution: TransactionExecution;
  createTransactionTemplate: TransactionTemplate;
  deleteContract: Scalars['UUID'];
  deleteScriptTemplate: Scalars['UUID'];
  deleteTransactionTemplate: Scalars['UUID'];
  setActiveProjectId?: Maybe<Scalars['Boolean']>;
  updateAccount: Account;
  updateCachedExecutionResults?: Maybe<Scalars['Boolean']>;
  updateContract: Contract;
  updateProject: Project;
  updateScriptTemplate: ScriptTemplate;
  updateTransactionTemplate: TransactionTemplate;
};


export type MutationClearCachedExecutionResultsArgs = {
  resultType: ResultType;
};


export type MutationCreateContractArgs = {
  input: NewContract;
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


export type MutationDeleteContractArgs = {
  id: Scalars['UUID'];
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


export type MutationUpdateAccountArgs = {
  input: UpdateAccount;
};


export type MutationUpdateCachedExecutionResultsArgs = {
  resultType: ResultType;
  rawResult: Scalars['RawExecutionResult'];
  label?: Maybe<Scalars['String']>;
};


export type MutationUpdateContractArgs = {
  input: UpdateContract;
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

export type Account = {
  __typename?: 'Account';
  id: Scalars['UUID'];
  address: Scalars['Address'];
  draftCode: Scalars['String'];
  deployedCode: Scalars['String'];
  deployedContracts: Array<Scalars['String']>;
  state: Scalars['String'];
};

export type ScriptExecution = {
  __typename?: 'ScriptExecution';
  id: Scalars['UUID'];
  script: Scalars['String'];
  arguments?: Maybe<Array<Scalars['String']>>;
  errors?: Maybe<Array<ProgramError>>;
  value: Scalars['String'];
  logs: Array<Scalars['String']>;
};

export type NewProject = {
  parentId?: Maybe<Scalars['UUID']>;
  title: Scalars['String'];
  seed: Scalars['Int'];
  accounts?: Maybe<Array<Scalars['String']>>;
  contracts?: Maybe<Array<NewProjectContract>>;
  transactionTemplates?: Maybe<Array<NewProjectTransactionTemplate>>;
  scriptTemplates?: Maybe<Array<NewProjectScriptTemplate>>;
};

export type NewTransactionTemplate = {
  projectId: Scalars['UUID'];
  title: Scalars['String'];
  script: Scalars['String'];
};


export type ScriptTemplate = {
  __typename?: 'ScriptTemplate';
  id: Scalars['UUID'];
  index: Scalars['Int'];
  title: Scalars['String'];
  script: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  account: Account;
  activeProject: Scalars['Boolean'];
  activeProjectId?: Maybe<Scalars['Int']>;
  cachedExecutionResults: Array<Maybe<ExecutionResults>>;
  contract: Contract;
  localProject?: Maybe<Project>;
  playgroundInfo: PlaygroundInfo;
  project: Project;
  scriptTemplate: ScriptTemplate;
  transactionTemplate: TransactionTemplate;
};


export type QueryAccountArgs = {
  accountId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  projectId: Scalars['UUID'];
};


export type QueryContractArgs = {
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

export type UpdateProject = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  persist?: Maybe<Scalars['Boolean']>;
};

export type UpdateScriptTemplate = {
  id: Scalars['UUID'];
  title?: Maybe<Scalars['String']>;
  projectId: Scalars['UUID'];
  index?: Maybe<Scalars['Int']>;
  script?: Maybe<Scalars['String']>;
};



export enum ResultType {
  Transaction = 'TRANSACTION',
  Script = 'SCRIPT',
  Contract = 'CONTRACT'
}

export type ExecutionResult = {
  __typename?: 'ExecutionResult';
  timestamp?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['ExecutionResultValue']>;
  label?: Maybe<Scalars['String']>;
};

export type ExecutionResults = {
  __typename?: 'ExecutionResults';
  TRANSACTION?: Maybe<Array<Maybe<ExecutionResult>>>;
  SCRIPT?: Maybe<Array<Maybe<ExecutionResult>>>;
  CONTRACT?: Maybe<Array<Maybe<ExecutionResult>>>;
};

export type ExecutionResultInput = {
  data?: Maybe<Scalars['RawExecutionResult']>;
};

export type CreateProjectMutationVariables = Exact<{
  parentId?: Maybe<Scalars['UUID']>;
  accounts: Array<Scalars['String']>;
  seed: Scalars['Int'];
  title: Scalars['String'];
  contracts: Array<NewProjectContract>;
  transactionTemplates: Array<NewProjectTransactionTemplate>;
  scriptTemplates: Array<NewProjectScriptTemplate>;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { project: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'parentId' | 'mutable'>
    & { accounts?: Maybe<Array<(
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'address' | 'draftCode' | 'deployedCode' | 'state'>
    )>> }
  ) }
);

export type PersistProjectMutationVariables = Exact<{
  projectId: Scalars['UUID'];
}>;


export type PersistProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'persist'>
  ) }
);

export type SetActiveProjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SetActiveProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setActiveProjectId'>
);

export type UpdateAccountDraftCodeMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  accountId: Scalars['UUID'];
  code: Scalars['String'];
}>;


export type UpdateAccountDraftCodeMutation = (
  { __typename?: 'Mutation' }
  & { updateAccount: (
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'address' | 'draftCode' | 'deployedCode'>
  ) }
);

export type UpdateAccountDeployedCodeMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  accountId: Scalars['UUID'];
  contractId: Scalars['UUID'];
  code: Scalars['String'];
}>;


export type UpdateAccountDeployedCodeMutation = (
  { __typename?: 'Mutation' }
  & { updateAccount: (
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'address' | 'draftCode' | 'deployedCode' | 'deployedContracts'>
  ) }
);

export type UpdateContractMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  contractId: Scalars['UUID'];
  script: Scalars['String'];
  title?: Maybe<Scalars['String']>;
}>;


export type UpdateContractMutation = (
  { __typename?: 'Mutation' }
  & { updateContract: (
    { __typename?: 'Contract' }
    & Pick<Contract, 'id' | 'accountId' | 'script' | 'title' | 'index'>
  ) }
);

export type UpdateContractDeployedScriptMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  contractId: Scalars['UUID'];
  script: Scalars['String'];
  title?: Maybe<Scalars['String']>;
}>;


export type UpdateContractDeployedScriptMutation = (
  { __typename?: 'Mutation' }
  & { updateContract: (
    { __typename?: 'Contract' }
    & Pick<Contract, 'id' | 'accountId' | 'script' | 'title' | 'index'>
  ) }
);

export type CreateContractMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  index: Scalars['Int'];
  script: Scalars['String'];
  title: Scalars['String'];
}>;


export type CreateContractMutation = (
  { __typename?: 'Mutation' }
  & { createContract: (
    { __typename?: 'Contract' }
    & Pick<Contract, 'id' | 'accountId' | 'script' | 'title' | 'index'>
  ) }
);

export type DeleteContractMutationVariables = Exact<{
  projectId: Scalars['UUID'];
  contractId: Scalars['UUID'];
}>;


export type DeleteContractMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteContract'>
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
  signers?: Maybe<Array<Scalars['Address']>>;
  arguments?: Maybe<Array<Scalars['String']>>;
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
  arguments?: Maybe<Array<Scalars['String']>>;
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

export type GetProjectQueryVariables = Exact<{
  projectId: Scalars['UUID'];
}>;


export type GetProjectQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'persist' | 'mutable' | 'parentId' | 'seed' | 'title'>
    & { accounts?: Maybe<Array<(
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'address' | 'draftCode' | 'deployedCode' | 'deployedContracts' | 'state'>
    )>>, contracts?: Maybe<Array<(
      { __typename?: 'Contract' }
      & Pick<Contract, 'id' | 'accountId' | 'script' | 'title' | 'index'>
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
    & Pick<Project, 'id' | 'persist' | 'mutable' | 'parentId' | 'seed' | 'title'>
    & { accounts?: Maybe<Array<(
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'address' | 'draftCode' | 'deployedCode' | 'deployedContracts' | 'state'>
    )>>, contracts?: Maybe<Array<(
      { __typename?: 'Contract' }
      & Pick<Contract, 'id' | 'script' | 'title' | 'index'>
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
    mutation CreateProject($parentId: UUID, $accounts: [String!]!, $seed: Int!, $title: String!, $contracts: [NewProjectContract!]!, $transactionTemplates: [NewProjectTransactionTemplate!]!, $scriptTemplates: [NewProjectScriptTemplate!]!) {
  project: createProject(input: {parentId: $parentId, accounts: $accounts, seed: $seed, title: $title, contracts: $contracts, transactionTemplates: $transactionTemplates, scriptTemplates: $scriptTemplates}) {
    id
    parentId
    mutable
    accounts {
      id
      address
      draftCode
      deployedCode
      state
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
 *      accounts: // value for 'accounts'
 *      seed: // value for 'seed'
 *      title: // value for 'title'
 *      contracts: // value for 'contracts'
 *      transactionTemplates: // value for 'transactionTemplates'
 *      scriptTemplates: // value for 'scriptTemplates'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = ApolloReactCommon.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const PersistProjectDocument = gql`
    mutation PersistProject($projectId: UUID!) {
  updateProject(input: {id: $projectId, persist: true}) {
    id
    persist
  }
}
    `;
export type PersistProjectMutationFn = ApolloReactCommon.MutationFunction<PersistProjectMutation, PersistProjectMutationVariables>;

/**
 * __usePersistProjectMutation__
 *
 * To run a mutation, you first call `usePersistProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePersistProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [persistProjectMutation, { data, loading, error }] = usePersistProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function usePersistProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PersistProjectMutation, PersistProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<PersistProjectMutation, PersistProjectMutationVariables>(PersistProjectDocument, baseOptions);
      }
export type PersistProjectMutationHookResult = ReturnType<typeof usePersistProjectMutation>;
export type PersistProjectMutationResult = ApolloReactCommon.MutationResult<PersistProjectMutation>;
export type PersistProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<PersistProjectMutation, PersistProjectMutationVariables>;
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
export const UpdateAccountDraftCodeDocument = gql`
    mutation UpdateAccountDraftCode($projectId: UUID!, $accountId: UUID!, $code: String!) {
  updateAccount(input: {projectId: $projectId, id: $accountId, draftCode: $code}) {
    id
    address
    draftCode
    deployedCode
  }
}
    `;
export type UpdateAccountDraftCodeMutationFn = ApolloReactCommon.MutationFunction<UpdateAccountDraftCodeMutation, UpdateAccountDraftCodeMutationVariables>;

/**
 * __useUpdateAccountDraftCodeMutation__
 *
 * To run a mutation, you first call `useUpdateAccountDraftCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountDraftCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountDraftCodeMutation, { data, loading, error }] = useUpdateAccountDraftCodeMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      accountId: // value for 'accountId'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useUpdateAccountDraftCodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAccountDraftCodeMutation, UpdateAccountDraftCodeMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateAccountDraftCodeMutation, UpdateAccountDraftCodeMutationVariables>(UpdateAccountDraftCodeDocument, baseOptions);
      }
export type UpdateAccountDraftCodeMutationHookResult = ReturnType<typeof useUpdateAccountDraftCodeMutation>;
export type UpdateAccountDraftCodeMutationResult = ApolloReactCommon.MutationResult<UpdateAccountDraftCodeMutation>;
export type UpdateAccountDraftCodeMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAccountDraftCodeMutation, UpdateAccountDraftCodeMutationVariables>;
export const UpdateAccountDeployedCodeDocument = gql`
    mutation UpdateAccountDeployedCode($projectId: UUID!, $accountId: UUID!, $contractId: UUID!, $code: String!) {
  updateAccount(input: {projectId: $projectId, id: $accountId, contractId: $contractId, deployedCode: $code}) {
    id
    address
    draftCode
    deployedCode
    deployedContracts
  }
}
    `;
export type UpdateAccountDeployedCodeMutationFn = ApolloReactCommon.MutationFunction<UpdateAccountDeployedCodeMutation, UpdateAccountDeployedCodeMutationVariables>;

/**
 * __useUpdateAccountDeployedCodeMutation__
 *
 * To run a mutation, you first call `useUpdateAccountDeployedCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountDeployedCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountDeployedCodeMutation, { data, loading, error }] = useUpdateAccountDeployedCodeMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      accountId: // value for 'accountId'
 *      contractId: // value for 'contractId'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useUpdateAccountDeployedCodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAccountDeployedCodeMutation, UpdateAccountDeployedCodeMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateAccountDeployedCodeMutation, UpdateAccountDeployedCodeMutationVariables>(UpdateAccountDeployedCodeDocument, baseOptions);
      }
export type UpdateAccountDeployedCodeMutationHookResult = ReturnType<typeof useUpdateAccountDeployedCodeMutation>;
export type UpdateAccountDeployedCodeMutationResult = ApolloReactCommon.MutationResult<UpdateAccountDeployedCodeMutation>;
export type UpdateAccountDeployedCodeMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAccountDeployedCodeMutation, UpdateAccountDeployedCodeMutationVariables>;
export const UpdateContractDocument = gql`
    mutation UpdateContract($projectId: UUID!, $contractId: UUID!, $script: String!, $title: String) {
  updateContract(input: {projectId: $projectId, id: $contractId, script: $script, title: $title}) {
    id
    accountId
    script
    title
    index
  }
}
    `;
export type UpdateContractMutationFn = ApolloReactCommon.MutationFunction<UpdateContractMutation, UpdateContractMutationVariables>;

/**
 * __useUpdateContractMutation__
 *
 * To run a mutation, you first call `useUpdateContractMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContractMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContractMutation, { data, loading, error }] = useUpdateContractMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      contractId: // value for 'contractId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateContractMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateContractMutation, UpdateContractMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateContractMutation, UpdateContractMutationVariables>(UpdateContractDocument, baseOptions);
      }
export type UpdateContractMutationHookResult = ReturnType<typeof useUpdateContractMutation>;
export type UpdateContractMutationResult = ApolloReactCommon.MutationResult<UpdateContractMutation>;
export type UpdateContractMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateContractMutation, UpdateContractMutationVariables>;
export const UpdateContractDeployedScriptDocument = gql`
    mutation UpdateContractDeployedScript($projectId: UUID!, $contractId: UUID!, $script: String!, $title: String) {
  updateContract(input: {projectId: $projectId, id: $contractId, deployedScript: $script, title: $title}) {
    id
    accountId
    script
    title
    index
  }
}
    `;
export type UpdateContractDeployedScriptMutationFn = ApolloReactCommon.MutationFunction<UpdateContractDeployedScriptMutation, UpdateContractDeployedScriptMutationVariables>;

/**
 * __useUpdateContractDeployedScriptMutation__
 *
 * To run a mutation, you first call `useUpdateContractDeployedScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContractDeployedScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContractDeployedScriptMutation, { data, loading, error }] = useUpdateContractDeployedScriptMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      contractId: // value for 'contractId'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateContractDeployedScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateContractDeployedScriptMutation, UpdateContractDeployedScriptMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateContractDeployedScriptMutation, UpdateContractDeployedScriptMutationVariables>(UpdateContractDeployedScriptDocument, baseOptions);
      }
export type UpdateContractDeployedScriptMutationHookResult = ReturnType<typeof useUpdateContractDeployedScriptMutation>;
export type UpdateContractDeployedScriptMutationResult = ApolloReactCommon.MutationResult<UpdateContractDeployedScriptMutation>;
export type UpdateContractDeployedScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateContractDeployedScriptMutation, UpdateContractDeployedScriptMutationVariables>;
export const CreateContractDocument = gql`
    mutation CreateContract($projectId: UUID!, $index: Int!, $script: String!, $title: String!) {
  createContract(input: {projectId: $projectId, index: $index, script: $script, title: $title}) {
    id
    accountId
    script
    title
    index
  }
}
    `;
export type CreateContractMutationFn = ApolloReactCommon.MutationFunction<CreateContractMutation, CreateContractMutationVariables>;

/**
 * __useCreateContractMutation__
 *
 * To run a mutation, you first call `useCreateContractMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContractMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContractMutation, { data, loading, error }] = useCreateContractMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      index: // value for 'index'
 *      script: // value for 'script'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateContractMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateContractMutation, CreateContractMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateContractMutation, CreateContractMutationVariables>(CreateContractDocument, baseOptions);
      }
export type CreateContractMutationHookResult = ReturnType<typeof useCreateContractMutation>;
export type CreateContractMutationResult = ApolloReactCommon.MutationResult<CreateContractMutation>;
export type CreateContractMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateContractMutation, CreateContractMutationVariables>;
export const DeleteContractDocument = gql`
    mutation DeleteContract($projectId: UUID!, $contractId: UUID!) {
  deleteContract(id: $contractId, projectId: $projectId)
}
    `;
export type DeleteContractMutationFn = ApolloReactCommon.MutationFunction<DeleteContractMutation, DeleteContractMutationVariables>;

/**
 * __useDeleteContractMutation__
 *
 * To run a mutation, you first call `useDeleteContractMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContractMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContractMutation, { data, loading, error }] = useDeleteContractMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      contractId: // value for 'contractId'
 *   },
 * });
 */
export function useDeleteContractMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteContractMutation, DeleteContractMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteContractMutation, DeleteContractMutationVariables>(DeleteContractDocument, baseOptions);
      }
export type DeleteContractMutationHookResult = ReturnType<typeof useDeleteContractMutation>;
export type DeleteContractMutationResult = ApolloReactCommon.MutationResult<DeleteContractMutation>;
export type DeleteContractMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteContractMutation, DeleteContractMutationVariables>;
export const UpdateTransactionTemplateDocument = gql`
    mutation UpdateTransactionTemplate($projectId: UUID!, $templateId: UUID!, $script: String!, $title: String) {
  updateTransactionTemplate(input: {projectId: $projectId, id: $templateId, script: $script, title: $title}) {
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
  createTransactionTemplate(input: {projectId: $projectId, script: $script, title: $title}) {
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
  createTransactionExecution(input: {projectId: $projectId, script: $script, signers: $signers, arguments: $arguments}) {
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
  updateScriptTemplate(input: {projectId: $projectId, id: $templateId, script: $script, title: $title}) {
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
  createScriptTemplate(input: {projectId: $projectId, script: $script, title: $title}) {
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
  createScriptExecution(input: {projectId: $projectId, script: $script, arguments: $arguments}) {
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
export const SetExecutionResultsDocument = gql`
    mutation SetExecutionResults($resultType: ResultType!, $rawResult: RawExecutionResult!, $label: String) {
  updateCachedExecutionResults(resultType: $resultType, rawResult: $rawResult, label: $label) @client
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
export const GetProjectDocument = gql`
    query GetProject($projectId: UUID!) {
  project(id: $projectId) {
    id
    persist
    mutable
    parentId
    seed
    title
    accounts {
      id
      address
      draftCode
      deployedCode
      deployedContracts
      state
    }
    contracts {
      id
      accountId
      script
      title
      index
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
    accounts {
      id
      address
      draftCode
      deployedCode
      deployedContracts
      state
    }
    contracts {
      id
      script
      title
      index
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
    