import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { normalizeInteractionResponse } from 'util/normalize-interaction-response';
import {
  SetExecutionResultsMutationVariables,
  ClearExecutionResultsMutationVariables,
  ResultType,
} from './generated/graphql';

function getResultTypeFragment(resultType: ResultType) {
  switch (resultType) {
    case 'TRANSACTION':
      return gql`
        fragment txResults on ExecutionResults {
          TRANSACTION {
            timestamp
            tag
            value
            label
          }
        }
      `;
    case 'SCRIPT':
      return gql`
        fragment scriptResults on ExecutionResults {
          SCRIPT {
            timestamp
            tag
            value
            label
          }
        }
      `;
    case 'CONTRACT':
      return gql`
        fragment contractResults on ExecutionResults {
          CONTRACT {
            timestamp
            tag
            value
            label
          }
        }
      `;
  }
}

const localResolvers = {
  Query: {
    cachedExecutionResults: (
      _root: any,
      _: any,
      { cache }: { cache: InMemoryCache },
    ): any => {
      const query = gql`
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

      const results: any = cache.readQuery({ query });
      return results;
    },
  },
  Mutation: {
    updateCachedExecutionResults: (
      _root: any,
      { resultType, label, rawResult }: SetExecutionResultsMutationVariables,
      { cache }: { cache: InMemoryCache },
    ): any => {
      const query = gql`
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

      const id = 'ExecutionResults:0';
      const fragment = getResultTypeFragment(resultType);

      const previous: any = cache.readQuery({ query });
      const results = normalizeInteractionResponse(rawResult);

      const update = {
        __typename: 'ExecutionResults',
        [resultType]: [
          ...previous.cachedExecutionResults[resultType],
          ...results.map((result) => ({
            __typename: 'ExecutionResult',
            ...result,
            label,
          })),
        ],
      };
      cache.writeFragment({ fragment, id, data: update });
      return true;
    },
    clearCachedExecutionResults: (
      _root: any,
      { resultType }: ClearExecutionResultsMutationVariables,
      { cache }: { cache: InMemoryCache },
    ): any => {
      const id = 'ExecutionResults:0';
      const fragment = getResultTypeFragment(resultType);

      const update: any = {
        __typename: 'ExecutionResults',
        [resultType]: [],
      };
      cache.writeFragment({ fragment, id, data: update });
      return true;
    },
    setActiveProjectId: (
      _root: any,
      { id }: any,
      { cache }: { cache: InMemoryCache },
    ): any => {
      cache.writeData({
        data: {
          activeProjectId: id,
        },
      });
      return null;
    },
  },
};

export default localResolvers;
