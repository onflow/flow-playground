import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import DebounceLink from 'apollo-link-debounce';
import { HttpLink } from 'apollo-link-http';
import SerializingLink from 'apollo-link-serialize';
import fetch from 'isomorphic-fetch';
import { ResultType } from './generated/graphql';
import localResolvers from './resolvers';
import { onError } from 'apollo-link-error';
import { GET_APPLICATION_ERRORS } from './queries';
import * as Sentry from "@sentry/react"
const PLAYGROUND_API = process.env.PLAYGROUND_API;
const DEFAULT_DEBOUNCE_TIMEOUT = 1200; // Debounce time in ms

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache: cache,
  link: ApolloLink.from([
    new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
    new SerializingLink(),
    onError(({ response }) => {
      const { errors, extensions } = response;
      const errorCode = extensions.code;
      const error = errors[0];
      let errorMessage;
      Sentry.captureException(error);
      switch (errorCode) {
        case 'BAD_REQUEST':
          errorMessage = errors[0].message;
          break;
        case 'GRAPHQL_VALIDATION_FAILED':
          
          errorMessage = 'GraphQlError. Invalid request';
          break;
        case 'INTERNAL_SERVER_ERROR':
          errorMessage = `Oops! Something went wrong. If you'd like, please report the Bug. Thank you!`;
          break;
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
