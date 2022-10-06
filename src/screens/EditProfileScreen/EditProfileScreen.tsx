import React, {useEffect, useState} from 'react';
import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';

import ApiErrorMessage from '../../components/ApiErrorMessage';

import {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  GetUserQuery,
  GetUserQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  User,
  UsersByUsernameQuery,
  UsersByUsernameQueryVariables,
} from '../../API';

import {deleteUser, getUser, updateUser, usersByUsername} from './query';
import styles from './styles';
import {useAuthContext} from '../../context/AuthContext';
import CustomInput, {IEditableUser} from './CustomInput';

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);
  const {control, handleSubmit, setValue} = useForm<IEditableUser>({});
  const {userId, user: authUser} = useAuthContext();

  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );
  const [getUsersByUsername] = useLazyQuery<
    UsersByUsernameQuery,
    UsersByUsernameQueryVariables
  >(usersByUsername);
  const [
    onUpdateUser,
    {data: updateData, loading: updateLoading, error: updateError},
  ] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser);
  const [removeUser, {loading: deleteLoading, error: deleteErorr}] =
    useMutation<DeleteUserMutation, DeleteUserMutationVariables>(deleteUser);

  const user = data?.getUser;

  async function onSubmit(formData: IEditableUser) {
    await onUpdateUser({
      variables: {
        input: {
          id: userId,
          ...formData,
          _version: user?._version,
        },
      },
    });

    if (navigation.goBack) {
      navigation.goBack();
    }
  }

  function onChangePhoto() {
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, assets}) => {
        if (!didCancel && !errorCode && assets?.length) {
          setSelectedPhoto(assets[0]);
        }
      },
    );
  }

  async function onDeleteUser() {
    if (!user) return;
    // delete form db
    await removeUser({
      variables: {input: {id: userId, _version: user?._version}},
    });
    //delete from cognito
    authUser?.deleteUser(err => {
      if (err) {
        console.log({err});
      }
      Auth.signOut();
    });
  }

  function confirmDelete() {
    Alert.alert('Are you sure?', 'Deleting your user profile is permanent', [
      {
        text: 'Yes, Delete',
        style: 'destructive',
        onPress: onDeleteUser,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  async function validateUsername(username: string) {
    try {
      const response = await getUsersByUsername({
        variables: {username: username},
      });

      if (response.error) {
        Alert.alert('Failed to fetch username');
        return 'Failed to fetch username';
      }
      const users = response.data?.usersByUsername?.items;
      if (users && users?.length > 0 && users?.[0]?.id !== userId) {
        return 'Username is already taken';
      } else {
        return true;
      }
    } catch (err) {
      Alert.alert('Failed to fetch username.');
    }

    return 'Username is already taken.';
  }

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('username', user.username);
      setValue('bio', user.bio);
      setValue('website', user.website);
    }
  }, [user, setValue]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage
        title="Error fetching or updating the user"
        message={error.message || updateError?.message}
      />
    );
  }

  return (
    <View style={styles.page}>
      <Image
        source={{
          uri:
            selectedPhoto?.uri || user?.image || 'https://unsplash.it/100/100',
        }}
        style={styles.avatar}
      />
      <Text onPress={onChangePhoto} style={styles.textButton}>
        Change Profile Photo
      </Text>
      <CustomInput
        label="Name"
        name="name"
        rules={{required: 'Please enter name.'}}
        control={control}
      />
      <CustomInput
        label="Username"
        name="username"
        rules={{
          required: 'Please enter username.',
          minLength: {
            value: 3,
            message: 'Username should be more the 3 characters.',
          },
          validate: validateUsername,
        }}
        control={control}
      />
      <CustomInput
        label="Website"
        name="website"
        rules={{pattern: URL_REGEX}}
        control={control}
      />
      <CustomInput
        label="Bio"
        name="bio"
        rules={{
          maxLength: {
            value: 200,
            message: 'Bio should be less than 200 characters.',
          },
        }}
        control={control}
        multiline
      />
      <Text style={styles.textButton} onPress={handleSubmit(onSubmit)}>
        {updateLoading ? 'Submitting...' : 'Submit'}
      </Text>
      <Text style={styles.textButtonDanger} onPress={confirmDelete}>
        {updateLoading ? 'Deleting...' : 'Delete User'}
      </Text>
    </View>
  );
};

export default EditProfileScreen;
