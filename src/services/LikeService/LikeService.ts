import {useMutation, useQuery} from '@apollo/client';
import {
  CreateLikeMutation,
  CreateLikeMutationVariables,
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useAuthContext} from '../../context/AuthContext';
import {createLike, deleteLike, likesForPostByUser, updatePost} from './query';

const useLikeService = (post: Post) => {
  const {userId} = useAuthContext();

  const {data: userLikesData} = useQuery<
    LikesForPostByUserQuery,
    LikesForPostByUserQueryVariables
  >(likesForPostByUser, {
    variables: {postID: post.id, userID: {eq: userId}},
  });

  const userLike = (userLikesData?.likesForPostByUser?.items || []).filter(
    like => !like?._deleted,
  )?.[0];

  const [doUpdatePost] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const [doDeleteLike] = useMutation<
    DeleteLikeMutation,
    DeleteLikeMutationVariables
  >(deleteLike);

  const [doCreateLike] = useMutation<
    CreateLikeMutation,
    CreateLikeMutationVariables
  >(createLike, {
    variables: {input: {userID: userId, postID: post.id}},
    refetchQueries: ['LikesForPostByUser'],
  });

  function incrementLikes(value: 1 | -1) {
    doUpdatePost({
      variables: {
        input: {
          id: post.id,
          _version: post._version,
          nofLikes: post.nofLikes + value,
        },
      },
    });
  }

  const addLike = () => {
    doCreateLike();
    incrementLikes(1);
  };

  const removeLike = () => {
    if (userLike) {
      doDeleteLike({
        variables: {input: {id: userLike.id, _version: userLike._version}},
      });
      incrementLikes(-1);
    }
  };

  const togglePostLike = () => {
    if (userLike) {
      removeLike();
    } else {
      addLike();
    }
  };

  return {
    incrementLikes,
    togglePostLike,
    userLike,
  };
};

export default useLikeService;
