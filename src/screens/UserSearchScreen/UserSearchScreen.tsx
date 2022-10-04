import {useQuery} from '@apollo/client';
import React from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {ListUsersQuery, ListUsersQueryVariables} from '../../API';

import users from '../../assets/data/users.json';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import UserListItem from '../../components/UserListItem';
import {listUsers} from './queries';

const UserSearchScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListUsersQuery,
    ListUsersQueryVariables
  >(listUsers);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage
        title="Error fetching the users"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const users = (data?.listUsers?.items || []).filter(
    user => user && !user?._deleted,
  );

  return (
    <FlatList
      data={users}
      renderItem={({item}) => item && <UserListItem user={item} />}
      refreshing={loading}
      onRefresh={refetch}
    />
  );
};

export default UserSearchScreen;
