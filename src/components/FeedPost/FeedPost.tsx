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
import ActionMenu from './ActionMenu';
import useLikeService from '../../services/LikeService';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = (props: IFeedPost) => {
  const navigation = useNavigation<FeedNavigationProp>();
  const {post, isVisible} = props;

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {togglePostLike, userLike} = useLikeService(post);

  const postLike = post.Likes?.items.filter(item => !item?._deleted) || [];

  function toogleDescriptionExpanded() {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }

  function showUserProfile() {
    if (post.userID) {
      navigation.navigate('UserProfile', {userId: post.userID});
    }
  }

  function navigateToComments() {
    if (post.id) {
      navigation.navigate('Comments', {postId: post.id});
    }
  }

  function navigateToLikes() {
    if (post.id) {
      navigation.navigate('PostLikes', {id: post.id});
    }
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
            uri: post?.User?.image || 'https://unsplash.it/100/100',
          }}
          style={styles.userAvatar}
        />
        <Text onPress={showUserProfile} style={styles.userName}>
          {post?.User?.username || ''}
        </Text>
        <ActionMenu post={post} />
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
        {postLike.length === 0 ? (
          <Text>Be the first to like the post.</Text>
        ) : (
          <Text onPress={navigateToLikes}>
            Liked by{' '}
            <Text style={styles.bold}>{postLike[0]?.User?.username}</Text>{' '}
            {postLike.length > 1 && (
              <>
                & <Text style={styles.bold}>{post.nofLikes - 1} others</Text>
              </>
            )}
          </Text>
        )}
        {/* Post Description */}
        <Text style={styles.text} numberOfLines={isDescriptionExpanded ? 0 : 3}>
          <Text style={styles.bold}>{post?.User?.username || ''}</Text>
          {post.description}
        </Text>
        <Text onPress={toogleDescriptionExpanded}>
          Show {isDescriptionExpanded ? 'less' : 'more'}
        </Text>
        {/* Post comments */}
        {post.nofComments > 2 && (
          <Text onPress={navigateToComments}>
            View all {post.nofComments - 2} comments
          </Text>
        )}
        {post?.Comments?.items?.map(comment => {
          return comment && <Comment key={comment.id} comment={comment} />;
        })}
        {/* Posted date */}
        <Text>{dayjs(post.createdAt).fromNow()}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
