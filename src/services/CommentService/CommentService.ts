import {useMutation, useQuery} from '@apollo/client';
import {Alert} from 'react-native';
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useAuthContext} from '../../context/AuthContext';
import {createComment, getPost, updatePost} from './query';

const useCommentService = (postId: string) => {
  const {userId} = useAuthContext();

  const {data: postData} = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {variables: {id: postId}},
  );

  const post = postData?.getPost;

  const [doUpdatePost] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const [doCreateComment] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(createComment);

  async function saveComment(comment: string) {
    if (!post) {
      Alert.alert('Failed to load post. Try again later.');
      return;
    }
    try {
      await doCreateComment({
        variables: {
          input: {
            postID: postId,
            userID: userId,
            comment,
          },
        },
        refetchQueries: ['CommentsByPost'],
      });
      incrementComment(1);
    } catch (e) {
      Alert.alert('Error submitting the comment', (e as Error).message);
    }
  }

  function incrementComment(value: 1 | -1) {
    if (!post) {
      Alert.alert('Failed to load post. Try again later.');
      return;
    }
    doUpdatePost({
      variables: {
        input: {
          id: post.id,
          _version: post._version,
          nofComments: post.nofComments + value,
        },
      },
    });
  }

  return {saveComment};
};

export default useCommentService;
