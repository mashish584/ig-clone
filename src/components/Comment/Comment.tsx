import React, {useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import dayjs from 'dayjs';

import styles, {colors} from './styles';
import {Comment as CommentI} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';
import ProfileAvatar from '../ProfileAvatar';

interface ICommentProps {
  comment: CommentI;
  includeDetails?: boolean;
  isNewComment?: boolean;
}

const Comment = (props: ICommentProps) => {
  const {comment, includeDetails} = props;

  const [isCommentLiked, setIsCommentLiked] = useState(false);

  function toggleLike() {
    setIsCommentLiked(!isCommentLiked);
  }

  return (
    <View style={styles.comment}>
      {includeDetails && (
        // <Image source={{uri: DEFAULT_USER_IMAGE}} style={styles.avatar} />
        <ProfileAvatar
          image={comment.User?.image}
          style={styles.avatar}
          isSmallIcon={true}
        />
      )}
      <View style={styles.middleColumn}>
        <Text style={styles.commentText}>
          <Text style={styles.bold}>{comment.User?.username}</Text>{' '}
          {comment.comment}
        </Text>
        {includeDetails && (
          <View style={styles.commentFooter}>
            {props.isNewComment && (
              <View style={styles.newContainer}>
                <Text style={styles.newLabel}>New</Text>
              </View>
            )}
            <Text style={styles.footerText}>
              {dayjs(comment.createdAt).fromNow()}
            </Text>
            <Text style={styles.footerText}>0 likes</Text>
            <Text style={styles.footerText}>Reply</Text>
          </View>
        )}
      </View>
      <Pressable onPress={toggleLike} hitSlop={5}>
        <AntDesign
          name={isCommentLiked ? 'heart' : 'hearto'}
          size={16}
          style={styles.icon}
          color={isCommentLiked ? colors.accent : colors.black}
        />
      </Pressable>
    </View>
  );
};

export default Comment;
