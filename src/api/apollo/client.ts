import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";
import localResolvers from "./resolvers";

import { ResultType } from "./generated/graphql";

const api = process.env.GRAPHQL_API;

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache: cache,
  link: ApolloLink.from([
    new HttpLink({
      uri: api,
      credentials: "include",
      fetch
    })
  ]),
  resolvers: localResolvers
});

cache.writeData({
  data: {
    activeProjectId: null,
    activeProject: false,
    executionResults: {
      id: "0",
      __typename: "ExecutionResults",
      [ResultType.Transaction]: [],
      [ResultType.Script]: [],
      [ResultType.Contract]: []
    }
  }
});

export default client;
