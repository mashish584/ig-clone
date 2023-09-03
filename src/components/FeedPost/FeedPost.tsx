import {useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';

import styles, {colors} from './styles';

import Comment from '../Comment';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import DoublePress from '../DoublePressable';
import Carousel from '../Carousel';

import {FeedNavigationProp} from '../../types/navigation';
import {Post} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';
import PostMenu from './PostMenu';

import {useAuthContext} from '../../contexts/AuthContext';
import {usePostLikeService} from '../../hooks';
import Content from './Content';
import ProfileAvatar from '../ProfileAvatar';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
  onPostUpdate: () => void;
}

const FeedPost = (props: IFeedPost) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<FeedNavigationProp>();
  const {post, isVisible} = props;
  const {togglePostLike, isUserLiked, firstLikeUser, postLikes} =
    usePostLikeService(post, userId);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  function toogleDescriptionExpanded() {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }

  function showUserProfile() {
    if (post?.User) {
      navigation.navigate('UserProfile', {userId: post.User?.id});
    }
  }

  function navigateToComments() {
    navigation.navigate('Comments', {postId: post.id});
  }

  return (
    <View style={styles.post}>
      {/* Post Header */}
      <View style={styles.header}>
        <ProfileAvatar
          image={post.User?.image}
          style={styles.userAvatar}
          isSmallIcon={true}
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
      <DoublePress onDoublePress={togglePostLike}>
        <Content post={post} isVisible={isVisible} spacing={0} />
      </DoublePress>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={togglePostLike}>
            <AntDesign
              name={isUserLiked ? 'heart' : 'hearto'}
              size={24}
              style={styles.icon}
              color={isUserLiked ? colors.accent : colors.black}
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
                  const isNavigationAllowed =
                    !isUserLiked &&
                    firstLikeUser &&
                    firstLikeUser?.id !== userId;
                  if (isNavigationAllowed) {
                    navigation.navigate('UserProfile', {
                      userId: firstLikeUser?.id,
                    });
                  }
                }}
                style={styles.bold}>
                {firstLikeUser?.id === userId ? 'you' : firstLikeUser?.username}
              </Text>
              {postLikes?.length > 1 && (
                <Text
                  onPress={() =>
                    navigation.navigate('PostLikes', {id: post.id})
                  }
                  style={styles.bold}>
                  {' '}
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
          View all {post.nofComments}{' '}
          {post.nofComments > 1 ? 'comments' : 'comment'}
        </Text>

        {(post.Comments?.items || []).map(comment => {
          return comment && <Comment key={comment.id} comment={comment} />;
        })}
        {/* Posted date */}
        <Text>{dayjs(post.createdAt).fromNow()}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
