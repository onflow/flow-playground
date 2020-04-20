import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { normalizeInteractionResponse } from "../../util/normalize-interaction-response";
import {
  SetExecutionResultsMutationVariables,
  ClearExecutionResultsMutationVariables,
  GetExecutionResultsQueryVariables
} from "./generated/graphql";

const localResolvers = {
  Query: {
    getResults: (
      _root: any,
      { resultType }: GetExecutionResultsQueryVariables,
      { cache }: { cache: InMemoryCache }
    ): any => {
      const query = gql`
          query GetResults {
            executionResults {
              ${resultType} {
                timestamp
                tag
                value
                label
              }
            }
          }
        `;

      const results: any = cache.readQuery({ query });
      return results;
    }
  },
  Mutation: {
    updateResults: (
      _root: any,
      { resultType, label, rawResult }: SetExecutionResultsMutationVariables,
      { cache }: { cache: InMemoryCache }
    ): any => {
      const query = gql`
          query GetResults {
            executionResults {
              ${resultType} {
                timestamp
                tag
                value
                label
              }
            }
          }
        `;

      const id = "ExecutionResults:0";
      const fragment = gql`
        fragment results on ExecutionResults {
          ${resultType} {
            timestamp
            tag
            value
            label
          }
        }
      `;

      const previous: any = cache.readQuery({ query });
      const results = normalizeInteractionResponse(rawResult);

      const update = {
        __typename: "ExecutionResults",
        [resultType]: [
          ...previous.executionResults[resultType],
          ...results.map(result => ({
            __typename: "ExecutionResult",
            ...result,
            label
          }))
        ]
      };
      cache.writeFragment({ fragment, id, data: update });
      return true;
    },
    clearResults: (
      _root: any,
      { resultType }: ClearExecutionResultsMutationVariables,
      { cache }: { cache: InMemoryCache }
    ): any => {
      const id = "ExecutionResults:0";
      const fragment = gql`
        fragment results on ExecutionResults {
          ${resultType} {
            timestamp
            tag
            value
            label
          }
        }
      `;

      const update: any = {
        __typename: "ExecutionResults",
        [resultType]: []
      };
      cache.writeFragment({ fragment, id, data: update });
      return true;
    },
    setActiveProjectId: (
      _root: any,
      { id }: any,
      { cache }: { cache: InMemoryCache }
    ): any => {
      cache.writeData({
        data: {
          activeProjectId: id
        }
      });
      return null;
    }
  }
};

export default localResolvers;
