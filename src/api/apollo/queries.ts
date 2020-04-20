import gql from "graphql-tag";
import { ResultType } from "./generated/graphql";

export const GET_PROJECT = gql`
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

export const GET_LOCAL_PROJECT = gql`
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

export const GET_ACTIVE_PROJECT = gql`
  query GetActiveProject {
    activeProjectId @client
    activeProject @client
  }
`;

export const GET_EXECUTION_RESULTS = gql`
  fragment ExecutionResultDetails on ExecutionResult {
    timestamp
    tag
    value
  }

  query GetExecutionResults($resultType: ResultType!) {
    getResults(resultType: $resultType) @client {
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

export const getExecutionResultsByType = (resultType: ResultType) => {
  return gql` query GetResults {
    executionResults @client {
      ${resultType} {
        timestamp
        tag
        value
        label
      }
    }
  }
`;
};
