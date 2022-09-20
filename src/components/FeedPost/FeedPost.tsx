import {Image, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import styles, {colors} from './styles';

import Comment from '../Comment';
import {IPost} from '../../types/model';

interface IFeedPost {
  post: IPost;
}

const FeedPost = (props: IFeedPost) => {
  const {post} = props;
  return (
    <View style={styles.post}>
      {/* Post Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: post.user.image,
          }}
          style={styles.userAvatar}
        />
        <Text style={styles.userName}>{post.user.username}</Text>
        <Entypo
          name="dots-three-horizontal"
          size={16}
          style={styles.threeDots}
        />
      </View>
      {/* Content */}
      <Image
        source={{
          uri: post.image,
        }}
        style={styles.image}
      />
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <AntDesign
            name={'hearto'}
            size={24}
            style={styles.icon}
            color={colors.black}
          />
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
        <Text style={styles.text}>
          <Text style={styles.bold}>{post.user.username}</Text>{' '}
          {post.description}
        </Text>
        {/* Post comments */}
        <Text>View all {post.nofComments} comments</Text>
        {post.comments.map(comment => {
          return <Comment key={comment.id} comment={comment} />;
        })}
        {/* Posted date */}
        <Text>{post.createdAt}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
