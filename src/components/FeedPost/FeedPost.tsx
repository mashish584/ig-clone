import {useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
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
import {Post} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = (props: IFeedPost) => {
  console.log(props.post.User?.id);
  const navigation = useNavigation<FeedNavigationProp>();
  const {post, isVisible} = props;

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);

  function toogleDescriptionExpanded() {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }

  function togglePostLike() {
    setIsPostLiked(!isPostLiked);
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
        <Entypo
          name="dots-three-horizontal"
          size={16}
          style={styles.threeDots}
        />
      </View>
      {/* Content */}
      {content}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={togglePostLike}>
            <AntDesign
              name={isPostLiked ? 'heart' : 'hearto'}
              size={24}
              style={styles.icon}
              color={isPostLiked ? colors.accent : colors.black}
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
          Liked by <Text style={styles.bold}>abc</Text> &{' '}
          <Text style={styles.bold}>{post.nofLikes} others</Text>
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
