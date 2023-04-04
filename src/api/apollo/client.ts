import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import DebounceLink from 'apollo-link-debounce';
import { HttpLink } from 'apollo-link-http';
import SerializingLink from 'apollo-link-serialize';
import fetch from 'cross-fetch';
import { ResultType } from './generated/graphql';
import localResolvers from './resolvers';
import { onError } from 'apollo-link-error';
import { GET_APPLICATION_ERRORS } from './queries';
import * as Sentry from '@sentry/react';
import { GraphQLError, GraphQLErrorExtensions } from 'graphql';
const PLAYGROUND_API = process.env.PLAYGROUND_API;
const DEFAULT_DEBOUNCE_TIMEOUT = 1200; // Debounce time in ms
const { detect } = require('detect-browser');
const cache = new InMemoryCache();
const client = new ApolloClient({
  cache: cache,
  link: ApolloLink.from([
    new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
    new SerializingLink(),
    onError(({ graphQLErrors }) => {
      let errorMessage: string,
        extensions: GraphQLErrorExtensions = { code: '' },
        gqlError: GraphQLError;

      if (graphQLErrors) {
        gqlError = graphQLErrors[0];
        errorMessage = gqlError.message;
        extensions = gqlError.extensions;
      }
      const errorCode = extensions?.code;
      const browser = detect();
      switch (errorCode) {
        case 'BAD_REQUEST':
          console.log('Encountered User Error', gqlError);
          Sentry.captureException(gqlError);
          if (browser && browser.name === 'safari') {
            errorMessage =
              'Safari does not support cookies. Please use Chrome or Firefox.';
          }
          break;
        case 'GRAPHQL_VALIDATION_FAILED':
          console.log('Encountered GQL Error', gqlError);
          graphQLErrors.forEach((graphqlError) => {
            Sentry.captureException(graphqlError);
          });
          errorMessage = 'GraphQlError. Invalid request';
          break;
        case 'INTERNAL_SERVER_ERROR':
          console.log('Encountered Server Error', gqlError);
          errorMessage = `Oops! Something went wrong. If you'd like, please report the Bug. Thank you!`;
          break;
        case 'AUTHORIZATION_ERROR':
          console.log('Encountered Authorization Error', gqlError);
          errorMessage = 'User Not Authorized. Please check your cookies.';
          break;
        default:
          errorMessage = '';
      }

      cache.writeQuery({
        query: GET_APPLICATION_ERRORS,
        data: {
          errorMessage: errorMessage,
        },
      });
    }),
    new HttpLink({
      uri: PLAYGROUND_API + '/query',
      credentials: 'include',
      fetch,
    }),
  ]),
  resolvers: localResolvers,
});

cache.writeData({
  data: {
    localProject: null,
    activeProjectId: null,
    activeProject: false,
    errorMessage: '',
    cachedExecutionResults: {
      id: '0',
      __typename: 'ExecutionResults',
      [ResultType.Transaction]: [],
      [ResultType.Script]: [],
      [ResultType.Contract]: [],
    },
  },
});

export default client;
