import {Alert, Image, StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../../theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  UploadNavigationProp,
  UploadPostT,
  UploadRouteProp,
} from '../../types/navigation';
import Carousel from '../../components/Carousel/Carousel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import {useState} from 'react';
import Button from '../../components/Button/Button';
import {useMutation} from '@apollo/client';
import {createPost} from './queries';
import {CreatePostMutation, CreatePostMutationVariables} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import {useMediaUpload} from '../../hooks';
import Content from '../../components/FeedPost/Content';

const CreatePostScreen = () => {
  const navigation = useNavigation<UploadNavigationProp>();
  const route = useRoute<UploadRouteProp>();
  const {image, images, video} = route.params || {};

  const [isPostUploading, setIspostUploading] = useState(false);
  const [description, setDescription] = useState('');

  const {userId} = useAuthContext();
  const {uploadMultipleMedias} = useMediaUpload();
  const [uploadPost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost, {refetchQueries: ['PostsByDate']});

  const submitPost = async () => {
    const media: UploadPostT = {
      image: null,
      images: null,
      video: null,
    };

    const medias = images?.length ? images : [];
    if (image) {
      medias.push(image);
    } else if (video) {
      medias.push(video);
    }

    if (medias.length) {
      setIspostUploading(true);
      const mediaKeys = await uploadMultipleMedias(medias, userId);
      if (mediaKeys?.length === 1) {
        const key = video ? 'video' : 'image';
        media[key] = mediaKeys[0];
      } else if (mediaKeys && mediaKeys?.length > 1) {
        media.images = mediaKeys;
      }
    }

    try {
      const payload = {
        type: 'Post',
        description,
        ...media,
        nofComments: 0,
        nofLikes: 0,
        userID: userId,
      };

      await uploadPost({
        variables: {
          input: payload,
        },
      });
      setIspostUploading(false);
      navigation.popToTop();
      navigation.navigate('HomeStack');
    } catch (e) {
      setIspostUploading(false);
      Alert.alert('Error while creating post', (e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        <Content
          post={{image, images, video}}
          spacing={10}
          isVisible={false}
          runDownloadMedia={false}
        />
      </View>
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
        text={isPostUploading ? 'Wait...' : 'Create Post'}
        disabled={description?.length < 1 || isPostUploading}
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
