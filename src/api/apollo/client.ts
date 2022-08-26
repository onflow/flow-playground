import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import DebounceLink from 'apollo-link-debounce';
import { HttpLink } from 'apollo-link-http';
import SerializingLink from 'apollo-link-serialize';
import fetch from 'isomorphic-fetch';
import { ResultType } from './generated/graphql';
import localResolvers from './resolvers';

const PLAYGROUND_API = process.env.PLAYGROUND_API;
const DEFAULT_DEBOUNCE_TIMEOUT = 500;

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache: cache,
  link: ApolloLink.from([
    new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
    new SerializingLink(),
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
