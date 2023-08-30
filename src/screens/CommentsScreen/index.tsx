import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Comment from '../../components/Comment';
import Input from './Input';
import {useRoute} from '@react-navigation/native';
import useCommentService from '../../hooks/Comments/useCommentService';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';
import {CommentRouteProp} from '../../types/navigation';

const CommentsScreen = () => {
  const route = useRoute<CommentRouteProp>();
  const {bottom} = useSafeAreaInsets();
  const postId = route.params?.postId;

  const {
    comments,
    commentListingError,
    isCommentLoading,
    refetchComments,
    createComment,
    loadMoreComments,
  } = useCommentService(postId);

  if (commentListingError) {
    return (
      <ApiErrorMessage
        title="Error while fetching comments"
        message={commentListingError.message}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={comments}
        renderItem={({item}) => (
          <Comment comment={item} includeDetails={true} />
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center'}}>No comments available.</Text>
        }
        style={{padding: 10}}
        refreshing={isCommentLoading}
        onEndReachedThreshold={0.8}
        onRefresh={refetchComments}
        onEndReached={loadMoreComments}
        showsVerticalScrollIndicator={false}
      />
      <View style={{marginBottom: bottom}}>
        <Input onPost={createComment} />
      </View>
    </View>
  );
};

export default CommentsScreen;
