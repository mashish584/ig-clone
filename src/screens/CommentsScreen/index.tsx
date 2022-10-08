import {useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {CommentsByPostQuery, CommentsByPostQueryVariables} from '../../API';
import comments from '../../assets/data/comments.json';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import Comment from '../../components/Comment';
import {CommentRouteProp} from '../../types/navigation';
import Input from './Input';
import {commentsByPost} from './query';

const CommentsScreen = () => {
  const route = useRoute<CommentRouteProp>();
  const {postId} = route.params;

  const {data, loading, error} = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, {variables: {postID: postId}});

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage
        title="Error while fetching comments"
        message={error.message}
      />
    );
  }

  const comments = (data?.commentsByPost?.items || []).filter(
    comment => !comment?._deleted,
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={comments}
        renderItem={({item}) =>
          item && <Comment comment={item} includeDetails={true} />
        }
        style={{padding: 10}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text>No Comments. Be the first one to comment.</Text>
        )}
      />
      <Input postId={postId} />
    </View>
  );
};

export default CommentsScreen;
