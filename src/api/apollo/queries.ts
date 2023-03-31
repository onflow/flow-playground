import gql from 'graphql-tag';

export const GET_PROJECTS = gql`
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
        }
      }
    }
  }
`;

export const GET_PROJECT = gql`
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
      }
    }
  }
`;

export const GET_PROJECT_UPDATE_AT = gql`
  query GetProject($projectId: UUID!) {
    project(id: $projectId) {
      id
      updatedAt
    }
  }
`;

export const GET_LOCAL_PROJECT = gql`
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

export const GET_ACTIVE_PROJECT = gql`
  query GetActiveProject {
    activeProjectId @client
    activeProject @client
  }
`;

export const GET_CACHED_EXECUTION_RESULTS = gql`
  fragment ExecutionResultDetails on ExecutionResult {
    timestamp
    tag
    value
    label
  }

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
`;

export const GET_APPLICATION_ERRORS = gql`
  query GetApplicationErrors {
    errorMessage @client
  }
`;
