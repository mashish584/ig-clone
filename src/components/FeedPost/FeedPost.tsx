import {useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import styles, {colors} from './styles';

import Comment from '../Comment';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import DoublePress from '../DoublePressable';
import Carousel from '../Carousel';

import {FeedNavigationProp} from '../../types/navigation';
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
import {DEFAULT_USER_IMAGE} from '../../config';
import PostMenu from './PostMenu';
import {useMutation, useQuery} from '@apollo/client';
import {createLike, deleteLike, likesByPost, updatePost} from './queries';
import {useAuthContext} from '../../contexts/AuthContext';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
  onPostUpdate: () => void;
}

const FeedPost = (props: IFeedPost) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<FeedNavigationProp>();
  const {post, isVisible} = props;

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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

  const userLike = likesData?.likesByPost?.items?.[0];
  const postLikes = post.Likes?.items.filter(like => !like?._deleted) || [];
  const firstUserToLike = postLikes?.[0]?.User;
  const isLikedByAuthUser = firstUserToLike?.id === userId;

  function toogleDescriptionExpanded() {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }

  const updateLikeCount = (type: 'add' | 'remove') => {
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
  };

  async function togglePostLike() {
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
      submitLike({
        variables: {
          input: {
            postID: post.id,
            userID: userId,
          },
        },
      });
      updateLikeCount('add');
    }
  }

  function showUserProfile() {
    if (post?.User) {
      navigation.navigate('UserProfile', {userId: post.User?.id});
    }
  }

  function navigateToComments() {
    navigation.navigate('Comments', {postId: post.id});
  }

  let content = null;

  if (post.image) {
    content = (
      <DoublePress onDoublePress={togglePostLike}>
        <Image
          source={{
            uri: post.image,
          }}
          style={styles.image}
        />
      </DoublePress>
    );
  } else if (post.images) {
    content = <Carousel images={post.images} onDoublePress={togglePostLike} />;
  } else if (post.video) {
    content = (
      <DoublePress onDoublePress={togglePostLike}>
        <VideoPlayer uri={post.video} paused={!isVisible} />
      </DoublePress>
    );
  }

  return (
    <View style={styles.post}>
      {/* Post Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: post.User?.image || DEFAULT_USER_IMAGE,
          }}
          style={styles.userAvatar}
        />
        <Text onPress={showUserProfile} style={styles.userName}>
          {post.User?.username}
        </Text>
        <PostMenu
          post={{id: post.id, userID: post.userID, _version: post._version}}
          onDeleteCallback={props.onPostUpdate}
        />
      </View>
      {/* Content */}
      {content}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={togglePostLike}>
            <AntDesign
              name={userLike ? 'heart' : 'hearto'}
              size={24}
              style={styles.icon}
              color={userLike ? colors.accent : colors.black}
            />
          </Pressable>
          <Ionicons
            name="chatbubble-outline"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="send"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="bookmark"
            size={24}
            style={{marginLeft: 'auto'}}
            color={colors.black}
          />
        </View>
        {/* Post likes */}
        <Text>
          {postLikes?.length === 0 ? (
            <Text>Be the first to like this post.</Text>
          ) : (
            <>
              Liked by{' '}
              <Text
                onPress={() => {
                  if (!isLikedByAuthUser && firstUserToLike) {
                    navigation.navigate('UserProfile', {
                      userId: firstUserToLike?.id,
                    });
                  }
                }}
                style={styles.bold}>
                {isLikedByAuthUser ? 'you' : postLikes[0]?.User?.username}
              </Text>
              {postLikes.length > 1 && (
                <Text
                  onPress={() =>
                    navigation.navigate('PostLikes', {id: post.id})
                  }
                  style={styles.bold}>
                  & {post.nofLikes} others
                </Text>
              )}
            </>
          )}
        </Text>
        {/* Post Description */}
        <Text style={styles.text} numberOfLines={isDescriptionExpanded ? 0 : 3}>
          <Text style={styles.bold}>{post.User?.username}</Text>{' '}
          {post.description}
        </Text>
        <Text onPress={toogleDescriptionExpanded}>
          Show {isDescriptionExpanded ? 'less' : 'more'}
        </Text>
        {/* Post comments */}
        <Text onPress={navigateToComments}>
          View all {post.nofComments} comments
        </Text>
        {(post.Comments?.items || []).map(comment => {
          return comment && <Comment key={comment.id} comment={comment} />;
        })}
        {/* Posted date */}
        <Text>{post.createdAt}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
