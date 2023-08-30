import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../../theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  UpdatePostRouteProp,
  UploadNavigationProp,
  UploadRouteProp,
} from '../../types/navigation';
import Carousel from '../../components/Carousel/Carousel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import {useEffect, useState} from 'react';
import Button from '../../components/Button/Button';
import {useMutation, useQuery} from '@apollo/client';
import {getPost, updatePost} from './queries';
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';

const UpdatePostScreen = () => {
  const navigation = useNavigation<UploadNavigationProp>();
  const route = useRoute<UpdatePostRouteProp>();
  const {id} = route.params;

  const [description, setDescription] = useState('');

  const {data, loading, error} = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {
      variables: {id: id},
    },
  );

  const post = data?.getPost;

  const [updatePostInfo, {loading: updateLoading}] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  let mediaContent = null;

  if (post?.image) {
    mediaContent = (
      <Image
        source={{uri: post.image}}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    );
  } else if (post?.images?.length) {
    mediaContent = <Carousel images={post.images} />;
  } else if (post?.video) {
    mediaContent = <VideoPlayer uri={post.video} paused={true} />;
  }

  const onUpdatePost = async () => {
    if (!post) return;
    try {
      const payload = {
        id: post.id,
        _version: post._version,
        description,
      };
      await updatePostInfo({
        variables: {
          input: payload,
        },
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error while updating post', (e as Error).message);
    }
  };

  useEffect(() => {
    if (post?.description) {
      setDescription(post.description);
    }
  }, [post?.description]);

  if (loading) {
    return <ActivityIndicator size="small" />;
  }

  if (error) {
    return (
      <ApiErrorMessage
        title="Error while fetchin post details"
        message={error.message}
      />
    );
  }

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
        text={updateLoading ? 'Wait...' : 'Update Post'}
        disabled={description?.length < 1}
        onPress={onUpdatePost}
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

export default UpdatePostScreen;
