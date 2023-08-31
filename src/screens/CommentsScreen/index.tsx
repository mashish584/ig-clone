import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Comment from '../../components/Comment';
import Input from './Input';
import {useRoute} from '@react-navigation/native';
import {useCommentService, onNewComment} from '../../hooks/Comments';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';
import {CommentRouteProp} from '../../types/navigation';
import {useSubscription} from '@apollo/client';
import {
  OnNewCommentSubscription,
  OnNewCommentSubscriptionVariables,
} from '../../API';
import {colors} from '../../theme';

const CommentsScreen = () => {
  const route = useRoute<CommentRouteProp>();
  const {bottom} = useSafeAreaInsets();
  const [isNewCommentDetected, setIsNewCommentDetected] = useState(false);
  const postId = route.params?.postId;

  const {
    comments,
    commentListingError,
    isCommentLoading,
    refetchComments,
    createComment,
    loadMoreComments,
  } = useCommentService(postId);

  const {data: newCommentData} = useSubscription<
    OnNewCommentSubscription,
    OnNewCommentSubscriptionVariables
  >(onNewComment, {variables: {postID: postId}});

  useEffect(() => {
    if (newCommentData?.onNewComment?.id) {
      setIsNewCommentDetected(true);
    }
  }, [newCommentData]);

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
      {isNewCommentDetected && (
        <Pressable
          onPress={() => {
            refetchComments();
            setIsNewCommentDetected(false);
          }}
          style={styles.tapButton}>
          <Text style={{color: colors.white}}>👆Tap to refresh</Text>
        </Pressable>
      )}
      <FlatList
        data={comments}
        renderItem={({item}) =>
          item && (
            <Comment
              comment={item}
              includeDetails={true}
              isNewComment={item.id === newCommentData?.onNewComment?.id}
            />
          )
        }
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

const styles = StyleSheet.create({
  tapButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 150,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
});

export default CommentsScreen;
