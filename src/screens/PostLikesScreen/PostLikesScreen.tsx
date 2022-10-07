import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import React from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {likesForPostByUser, updatePost} from './query';
import {
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useRoute} from '@react-navigation/native';
import {PostLikesRoute} from '../../types/navigation';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import UserListItem from '../../components/UserListItem';
import {Post} from '../../models';

const PostLikesScreen = () => {
  const route = useRoute<PostLikesRoute>();

  const {data, error, loading, refetch} = useQuery<
    LikesForPostByUserQuery,
    LikesForPostByUserQueryVariables
  >(likesForPostByUser, {variables: {postID: route.params.id}});

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching likes" message={error.message} />
    );
  }

  const likes =
    data?.likesForPostByUser?.items?.filter(like => !like?._deleted) || [];

  return (
    <FlatList
      data={likes}
      renderItem={({item}) => <UserListItem user={item?.User} />}
      refreshing={loading}
      onRefresh={refetch}
    />
  );
};

export default PostLikesScreen;
