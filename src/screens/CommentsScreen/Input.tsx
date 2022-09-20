import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {colors, fonts} from '../../theme';

const Input = () => {
  const [newComment, setNewComment] = useState('');

  function onPost() {
    console.log('Submit Comment');
  }

  return (
    <View style={styles.root}>
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
      <Pressable onPress={onPost} style={styles.action}>
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
