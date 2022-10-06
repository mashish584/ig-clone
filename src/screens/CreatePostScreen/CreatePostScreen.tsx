import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TextInput, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CreatePostNavigationProp,
  CreatePostRouteProp,
} from '../../types/navigation';
import {colors} from '../../theme';
import Button from '../../components/Button';
import {useMutation} from '@apollo/client';
import {createPost} from './query';
import {CreatePostMutation, CreatePostMutationVariables} from '../../API';
import {useAuthContext} from '../../context/AuthContext';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';

const CreatePostScreen = () => {
  const [doCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);
  const [description, setDescription] = useState('');
  const route = useRoute<CreatePostRouteProp>();
  const {userId} = useAuthContext();
  const {image, images, video} = route.params;
  const navigation = useNavigation<CreatePostNavigationProp>();

  let content = null;

  if (image) {
    content = (
      <Image
        source={{
          uri: image,
        }}
        style={styles.image}
      />
    );
  } else if (images) {
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} paused={true} />;
  }

  const submit = async () => {
    try {
      const response = await doCreatePost({
        variables: {
          input: {
            description,
            image,
            video,
            images,
            nofComments: 0,
            nofLikes: 0,
            userID: userId,
          },
        },
      });
      navigation.popToTop();
      navigation.navigate('HomeStack');
    } catch (e) {
      Alert.alert('Error uploading the post');
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{content}</View>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        style={styles.input}
        multiline
        numberOfLines={5}
      />
      <Button text="Submit" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 10,
  },
  content: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    marginVertical: 10,
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
  },
});

export default CreatePostScreen;
