import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {colors, fonts} from '../../theme';

import {Post} from '../../API';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useCommentService from '../../services/CommentService/CommentService';

interface IInput {
  postId: string;
}

const Input = ({postId}: IInput) => {
  const insets = useSafeAreaInsets();
  const [newComment, setNewComment] = useState('');
  const {saveComment} = useCommentService(postId);

  const onPost = async () => {
    await saveComment(newComment);
    setNewComment('');
  };

  return (
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <Image
        source={{
          uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg',
        }}
        style={styles.image}
      />

      <TextInput
        placeholder="Write your comment..."
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        multiline={true}
      />
      <Pressable
        onPress={onPost}
        style={[styles.action, {bottom: insets.bottom + 5}]}>
        <Text style={styles.text}>POST</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  input: {
    flex: 0.8,
    borderColor: colors.border,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  action: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  text: {
    color: colors.primary,
    fontSize: fonts.size.s,
    fontWeight: fonts.weight.full,
  },
});

export default Input;
