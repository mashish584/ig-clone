import React from 'react';
import {ActivityIndicator, FlatList} from 'react-native';

import users from '../../assets/data/users.json';
import UserListItem from '../../components/UserListItem';
import {useQuery} from '@apollo/client';
import {listUsers} from './queries';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';
import {ListCommentsQueryVariables, ListUsersQuery} from '../../API';

const UserSearchScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListUsersQuery,
    ListCommentsQueryVariables
  >(listUsers, {variables: {filter: {_deleted: {ne: true}}}});

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching users" message={error?.message} />
    );
  }

  const users = data?.listUsers?.items || [];

  return (
    <FlatList
      data={users}
      renderItem={({item}) => item && <UserListItem user={item} />}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
};

export default UserSearchScreen;
