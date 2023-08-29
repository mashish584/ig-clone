import {Alert} from 'react-native';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
  CommentsByPostIDQuery,
  CommentsByPostIDQueryVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import {commentsByPostID, createComment, getPost, updatePost} from './queries';

const useCommentService = (postId: string) => {
  const {userId} = useAuthContext();
  const {
    data: comments,
    loading: isCommentLoading,
    error: commentListingError,
    refetch: refetchComments,
  } = useQuery<CommentsByPostIDQuery, CommentsByPostIDQueryVariables>(
    commentsByPostID,
    {variables: {postID: postId}},
  );

  const [getPostInfo] = useLazyQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {
      variables: {id: postId},
    },
  );

  const [onCommentCreate] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(createComment);

  const [updatePostInfo] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const updateCommentCount = async (type: 'add' | 'remove') => {
    const response = await getPostInfo();
    const postDetails = response.data?.getPost;
    const value = type === 'add' ? 1 : -1;
    const totalComments = postDetails?.nofComments || 0;
    const nofComments =
      postDetails?.nofComments === 0 && type === 'remove'
        ? 0
        : value + totalComments;

    await updatePostInfo({
      variables: {
        input: {
          id: postId,
          nofComments,
          _version: postDetails?._version,
        },
      },
    });
  };

  const submitComment = async (comment: string) => {
    try {
      const response = await onCommentCreate({
        variables: {
          input: {
            postID: postId,
            userID: userId,
            comment: comment,
          },
        },
        refetchQueries: ['CommentsByPostID'],
      });
      updateCommentCount('add');
    } catch (err) {
      Alert.alert('Error while posting comment', (err as Error).message);
    }
  };

  return {
    comments: comments?.commentsByPostID?.items,
    isCommentLoading,
    commentListingError,
    refetchComments,
    createComment: submitComment,
  };
};

export default useCommentService;
