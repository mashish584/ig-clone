import {useMutation, useQuery} from '@apollo/client';
import {
  CreateLikeMutation,
  CreateLikeMutationVariables,
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  LikesByPostQuery,
  LikesByPostQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {createLike, deleteLike, likesByPost, updatePost} from './queries';

const usePostLikeService = (post: Post, userId: string) => {
  const {data: likesData} = useQuery<
    LikesByPostQuery,
    LikesByPostQueryVariables
  >(likesByPost, {
    variables: {
      postID: post.id,
      userID: {eq: userId},
      filter: {_deleted: {ne: true}},
    },
  });

  const [submitLike] = useMutation<
    CreateLikeMutation,
    CreateLikeMutationVariables
  >(createLike, {refetchQueries: ['LikesByPost']});

  const [removeLike] = useMutation<
    DeleteLikeMutation,
    DeleteLikeMutationVariables
  >(deleteLike, {refetchQueries: ['LikesByPost']});

  const [updatePostLikesCount] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const postLikes = post.Likes?.items.filter(like => !like?._deleted) || [];
  const userLike = likesData?.likesByPost?.items?.[0];
  const firstLikeUser = postLikes?.[0]?.User;

  const updateLikeCount = (type: 'add' | 'remove') => {
    try {
      const value = type === 'add' ? 1 : -1;
      const nofLikes =
        post.nofLikes === 0 && type === 'remove' ? 0 : value + post.nofLikes;
      updatePostLikesCount({
        variables: {
          input: {
            id: post.id,
            nofLikes,
            _version: post._version,
          },
        },
      });
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  const togglePostLike = async () => {
    try {
      if (userLike) {
        await removeLike({
          variables: {
            input: {
              id: userLike.id,
              _version: userLike._version,
            },
          },
        });
        updateLikeCount('remove');
      } else {
        await submitLike({
          variables: {
            input: {
              postID: post.id,
              userID: userId,
            },
          },
        });
        updateLikeCount('add');
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  return {
    togglePostLike,
    isUserLiked: !!userLike,
    firstLikeUser,
    postLikes,
  };
};

export default usePostLikeService;
