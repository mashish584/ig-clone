import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
  TypePolicies,
} from '@apollo/client';
import {AUTH_TYPE, AuthOptions, createAuthLink} from 'aws-appsync-auth-link';
import {createSubscriptionHandshakeLink} from 'aws-appsync-subscription-link';
import config from '../aws-exports';
import {useMemo} from 'react';
import {useAuthContext} from '../contexts/AuthContext';

interface ClientI {
  children: React.ReactNode;
}

const url = config.aws_appsync_graphqlEndpoint;
const region = config.aws_appsync_region;

const httpLink = createHttpLink({uri: url});

type ListItemParam = {
  items?: any[];
};

export const merge = (
  existing: ListItemParam = {items: []},
  incoming: ListItemParam = {items: []},
) => {
  return {
    ...existing,
    ...incoming,
    items: [...(existing.items || []), ...(incoming.items || [])],
  };
};

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      commentsByPostIDAndCreatedAt: {
        keyArgs: ['postID', 'createdAt', 'sortDirection', 'filter'],
        merge,
      },
      postsByDate: {
        keyArgs: ['type', 'createdAt', 'sortDirection', 'filter'],
        merge,
      },
    },
  },
};

const Client = ({children}: ClientI) => {
  const {user} = useAuthContext();
  const jwtToken =
    user?.getSignInUserSession()?.getAccessToken().getJwtToken() || '';

  const client = useMemo(() => {
    const auth: AuthOptions = {
      type: config.aws_appsync_authenticationType as AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken,
    };

    const link = ApolloLink.from([
      createAuthLink({url, region, auth}),
      createSubscriptionHandshakeLink({url, region, auth}, httpLink),
    ]);

    return new ApolloClient({
      link,
      cache: new InMemoryCache({
        typePolicies,
      }),
    });
  }, [jwtToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Client;
