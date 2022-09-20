import React from 'react';
import {View, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {IComment} from '../../types/model';
import styles, {colors} from './styles';

interface ICommentProps {
  comment: IComment;
}

const Comment = (props: ICommentProps) => {
  const {comment} = props;
  return (
    <View key={comment.id} style={styles.comment}>
      <Text style={styles.commentText}>
        <Text style={styles.bold}>{comment.user.username}</Text>{' '}
        {comment.comment}
      </Text>
      <AntDesign
        name={'hearto'}
        size={16}
        style={styles.icon}
        color={colors.black}
      />
    </View>
  );
};

export default Comment;
