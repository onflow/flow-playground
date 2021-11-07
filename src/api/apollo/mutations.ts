import gql from 'graphql-tag';

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $parentId: UUID
    $accounts: [String!]!
    $seed: Int!
    $title: String!
    $contracts: [NewProjectContract!]!
    $transactionTemplates: [NewProjectTransactionTemplate!]!
    $scriptTemplates: [NewProjectScriptTemplate!]!
  ) {
    project: createProject(
      input: {
        parentId: $parentId
        accounts: $accounts
        seed: $seed
        title: $title
        contracts: $contracts
        transactionTemplates: $transactionTemplates
        scriptTemplates: $scriptTemplates
      }
    ) {
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

export const PERSIST_PROJECT = gql`
  mutation PersistProject($projectId: UUID!) {
    updateProject(input: { id: $projectId, persist: true }) {
      id
      persist
    }
  }
`;

export const SET_ACTIVE_PROJECT = gql`
  mutation SetActiveProject($id: Int!) {
    setActiveProjectId(id: $id) @client
  }
`;

export const UPDATE_ACCOUNT_DRAFT_CODE = gql`
  mutation UpdateAccountDraftCode(
    $projectId: UUID!
    $accountId: UUID!
    $code: String!
  ) {
    updateAccount(
      input: { projectId: $projectId, id: $accountId, draftCode: $code }
    ) {
      id
      address
      draftCode
      deployedCode
    }
  }
`;

export const UPDATE_ACCOUNT_DEPLOYED_CODE = gql`
  mutation UpdateAccountDeployedCode(
    $projectId: UUID!
    $accountId: UUID!
    $contractId: UUID!
    $code: String!
  ) {
    updateAccount(
      input: { projectId: $projectId, id: $accountId, contractId: $contractId, deployedCode: $code }
    ) {
      id
      address
      draftCode
      deployedCode
      deployedContracts
    }
  }
`;

export const UPDATE_CONTRACT = gql`
  mutation UpdateContract(
    $projectId: UUID!
    $contractId: UUID!
    $script: String!
    $title: String
  ) {
    updateContract(
      input: { projectId: $projectId, id: $contractId, script: $script, title: $title }
    ) {
      id
      script
      title
      index
    }
  }
`;

export const DEPLOY_CONTRACT = gql`
  mutation DeployContract(
    $projectId: UUID!
    $accountId: UUID!
    $contractId: UUID!
    $code: String!
  ) {
    updateAccount(
      input: { projectId: $projectId, id: $accountId, contractId: $contractId, deployedCode: $code }
    ) {
      id
      address
      deployedContracts
    }
  }
`;

export const CREATE_CONTRACT = gql`
  mutation CreateContract(
    $projectId: UUID!
    $index: Int!
    $script: String!
    $title: String!
  ) {
    createContract(
      input: { projectId: $projectId, index: $index, script: $script, title: $title }
    ) {
      id
      script
      title
      index
    }
  }
`;

export const DELETE_CONTRACT = gql`
  mutation DeleteContract($projectId: UUID!, $contractId: UUID!) {
    deleteContract(id: $contractId, projectId: $projectId)
  }
`;

export const UPDATE_TRANSACTION_TEMPLATE = gql`
  mutation UpdateTransactionTemplate(
    $projectId: UUID!
    $templateId: UUID!
    $script: String!
    $title: String
  ) {
    updateTransactionTemplate(
      input: {
        projectId: $projectId
        id: $templateId
        script: $script
        title: $title
      }
    ) {
      id
      script
      index
      title
    }
  }
`;

export const CREATE_TRANSACTION_TEMPLATE = gql`
  mutation CreateTransactionTemplate(
    $projectId: UUID!
    $script: String!
    $title: String!
  ) {
    createTransactionTemplate(
      input: { projectId: $projectId, script: $script, title: $title }
    ) {
      id
      script
      title
    }
  }
`;

export const DELETE_TRANSACTION_TEMPLATE = gql`
  mutation DeleteTransactionTemplate($projectId: UUID!, $templateId: UUID!) {
    deleteTransactionTemplate(id: $templateId, projectId: $projectId)
  }
`;

export const CREATE_TRANSACTION_EXECUTION = gql`
  mutation CreateTransactionExecution(
    $projectId: UUID!
    $script: String!
    $signers: [Address!]
    $arguments: [String!]
  ) {
    createTransactionExecution(
      input: {
        projectId: $projectId
        script: $script
        signers: $signers
        arguments: $arguments
      }
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

export const UPDATE_SCRIPT_TEMPLATE = gql`
  mutation UpdateScripTemplate(
    $projectId: UUID!
    $templateId: UUID!
    $script: String!
    $title: String
  ) {
    updateScriptTemplate(
      input: {
        projectId: $projectId
        id: $templateId
        script: $script
        title: $title
      }
    ) {
      id
      script
      index
      title
    }
  }
`;

export const CREATE_SCRIPT_TEMPLATE = gql`
  mutation CreateScriptTemplate(
    $projectId: UUID!
    $script: String!
    $title: String!
  ) {
    createScriptTemplate(
      input: { projectId: $projectId, script: $script, title: $title }
    ) {
      id
      script
      title
    }
  }
`;

export const DELETE_SCRIPT_TEMPLATE = gql`
  mutation DeleteScriptTemplate($projectId: UUID!, $templateId: UUID!) {
    deleteScriptTemplate(id: $templateId, projectId: $projectId)
  }
`;

export const CREATE_SCRIPT_EXECUTION = gql`
  mutation CreateScriptExecution(
    $projectId: UUID!
    $script: String!
    $arguments: [String!]
  ) {
    createScriptExecution(
      input: { projectId: $projectId, script: $script, arguments: $arguments }
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

export const SET_EXECUTION_RESULT = gql`
  mutation SetExecutionResults(
    $resultType: ResultType!
    $rawResult: RawExecutionResult!
    $label: String
  ) {
    updateCachedExecutionResults(
      resultType: $resultType
      rawResult: $rawResult
      label: $label
    ) @client
  }
`;

export const CLEAR_EXECUTION_RESULTS = gql`
  mutation ClearExecutionResults($resultType: ResultType!) {
    clearCachedExecutionResults(resultType: $resultType) @client
  }
`;
