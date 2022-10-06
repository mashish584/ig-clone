import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TextInput, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CreatePostNavigationProp,
  UpdatePostRouteProp,
} from '../../types/navigation';
import {colors} from '../../theme';
import Button from '../../components/Button';
import {useMutation, useQuery} from '@apollo/client';
import {getPost, updatePost} from './query';
import {
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useAuthContext} from '../../context/AuthContext';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const UpdatePostScreen = () => {
  const [doUpdatePost, {data: updateData, error: updateError}] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);
  const [description, setDescription] = useState('');
  const route = useRoute<UpdatePostRouteProp>();
  const {userId} = useAuthContext();
  const {id} = route.params;
  const navigation = useNavigation<CreatePostNavigationProp>();
  const {data, loading, error} = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {variables: {id: id}},
  );

  const submit = async () => {
    if (loading) return;
    try {
      if (data?.getPost?.id) {
        const response = await doUpdatePost({
          variables: {
            input: {
              description,
              id: data?.getPost?.id,
              _version: data?.getPost?._version,
            },
          },
        });

        if (response?.data?.updatePost) {
          navigation.goBack();
        }
      }
    } catch (e) {
      Alert.alert('Error updating the post');
    }
  };

  useEffect(() => {
    if (data && data?.getPost?.description) {
      setDescription(data.getPost?.description);
    }
  }, [data]);

  if (error || updateError) {
    return (
      <ApiErrorMessage
        title="Failed to fetch the post"
        message={error?.message || updateError?.message}
      />
    );
  }

  return (
    <View style={styles.root}>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        style={styles.input}
        multiline
        numberOfLines={5}
      />
      <Button text={loading ? 'Submitting...' : 'Submit'} onPress={submit} />
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

export default UpdatePostScreen;
