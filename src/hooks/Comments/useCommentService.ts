import {Alert} from 'react-native';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
  CommentsByPostIDAndCreatedAtQuery,
  CommentsByPostIDAndCreatedAtQueryVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  ModelSortDirection,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import {
  commentsByPostIDAndCreatedAt,
  createComment,
  getPost,
  updatePost,
} from './queries';
import {useRef} from 'react';

const useCommentService = (postId: string) => {
  const isLoadingMoreComments = useRef(false);
  const {userId} = useAuthContext();
  const {
    data: comments,
    loading: isCommentLoading,
    error: commentListingError,
    refetch: refetchComments,
    fetchMore,
  } = useQuery<
    CommentsByPostIDAndCreatedAtQuery,
    CommentsByPostIDAndCreatedAtQueryVariables
  >(commentsByPostIDAndCreatedAt, {
    variables: {
      postID: postId,
      sortDirection: ModelSortDirection.DESC,
      limit: 2,
    },
  });

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

  const nextToken = comments?.commentsByPostIDAndCreatedAt?.nextToken;

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
      await onCommentCreate({
        variables: {
          input: {
            postID: postId,
            userID: userId,
            comment: comment,
          },
        },
        refetchQueries: ['CommentsByPostIDAndCreatedAt'],
      });
      updateCommentCount('add');
    } catch (err) {
      Alert.alert('Error while posting comment', (err as Error).message);
    }
  };

  const loadMoreComments = async () => {
    if (!nextToken || isLoadingMoreComments.current) {
      return;
    }
    isLoadingMoreComments.current = true;
    await fetchMore({variables: {nextToken}});
    isLoadingMoreComments.current = false;
  };

  return {
    comments: comments?.commentsByPostIDAndCreatedAt?.items || [],
    isCommentLoading,
    commentListingError,
    refetchComments,
    loadMoreComments,
    createComment: submitComment,
  };
};

export default useCommentService;
