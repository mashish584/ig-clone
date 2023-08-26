import {Alert, Image, StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../../theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {UploadNavigationProp, UploadRouteProp} from '../../types/navigation';
import Carousel from '../../components/Carousel/Carousel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import {useState} from 'react';
import Button from '../../components/Button/Button';
import {useMutation} from '@apollo/client';
import {createPost} from './queries';
import {CreatePostMutation, CreatePostMutationVariables} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';

const CreatePostScreen = () => {
  const navigation = useNavigation<UploadNavigationProp>();
  const route = useRoute<UploadRouteProp>();
  const {image, images, video} = route.params || {};

  const [description, setDescription] = useState('');

  const {userId} = useAuthContext();
  const [uploadPost, {loading}] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  let mediaContent = null;

  if (image) {
    mediaContent = (
      <Image
        source={{uri: image}}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    );
  } else if (images?.length) {
    mediaContent = <Carousel images={images} />;
  } else if (video) {
    mediaContent = <VideoPlayer uri={video} paused={true} />;
  }

  const submitPost = async () => {
    try {
      await uploadPost({
        variables: {
          input: {
            description,
            image,
            images,
            video,
            nofComments: 0,
            nofLikes: 0,
            userID: userId,
          },
        },
      });
      navigation.popToTop();
      navigation.navigate('HomeStack');
    } catch (e) {
      Alert.alert('Error while creating post', (e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>{mediaContent}</View>
      <View style={styles.descriptionContainer}>
        <TextInput
          placeholder="Enter description(*)"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={5}
          style={styles.descriptionInput}
        />
      </View>
      <Button
        text={loading ? 'Wait...' : 'Create Post'}
        disabled={description?.length < 1}
        onPress={submitPost}
        style={styles.ctaButton}
        textStyle={styles.ctaButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  descriptionContainer: {
    borderWidth: 0.5,
    borderColor: '#DCDCDC',
    paddingVertical: 10,
    marginBottom: 10,
  },
  descriptionInput: {
    width: '100%',
    height: 100,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  ctaButton: {
    minHeight: 50,
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  ctaButtonText: {
    color: colors.white,
  },
});

export default CreatePostScreen;
