import { onError } from 'apollo-link-error';

const errorLink = onError((response, graphQLErrors, networkError) => {
  console.log('link', graphQLErrors);
  console.log('response', response)
  console.log('link network', networkError)
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
})

export default errorLink;