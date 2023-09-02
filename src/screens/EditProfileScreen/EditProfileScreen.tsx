import React, {useEffect, useId, useState} from 'react';
import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

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
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {deleteUser, getUser, updateUser, usersByUsername} from './queries';
import {useAuthContext} from '../../contexts/AuthContext';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';
import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import CustomInput, {IEditableUser} from './CustomInput';
import styles from './styles';
import {DEFAULT_USER_IMAGE} from '../../config';

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const EditProfileScreen = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);
  const {control, handleSubmit, setValue} = useForm<IEditableUser>();
  const navigation = useNavigation();

  const {userId, user: authUser} = useAuthContext();

  const [getUserByUsername] = useLazyQuery<
    UsersByUsernameQuery,
    UsersByUsernameQueryVariables
  >(usersByUsername);
  const {data, error, loading} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );

  const [doUpdateuser, {loading: updateLoading, error: updateError}] =
    useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser);
  const [doDeleteUser, {loading: deleteLoading, error: deleteError}] =
    useMutation<DeleteUserMutation, DeleteUserMutationVariables>(deleteUser);

  const user = data?.getUser;

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('username', user.username);
      setValue('bio', user.bio);
      setValue('website', user.website);
    }
  }, [user]);

  async function onSubmit(formData: IEditableUser) {
    await doUpdateuser({
      variables: {
        input: {
          id: userId,
          ...formData,
          _version: user?._version,
        },
      },
    });

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  const validateUsername = async (username: string) => {
    try {
      const response = await getUserByUsername({variables: {username}});
      if (response.error) {
        return 'Failed to fetch username';
      }
      const users = response.data?.usersByUsername?.items;
      console.log({users});
      if (users?.length && username !== user?.username) {
        return 'Username already taken.';
      }
    } catch (err) {
      Alert.alert('Oops', 'Something went wrong.');
    }

    return true;
  };

  const removeUser = async () => {
    if (!user) return;
    //delete from db
    await doDeleteUser({
      variables: {input: {id: userId, _version: user?._version}},
    });
    //delete from cognito
    authUser?.deleteUser(err => {
      if (err) {
        console.log(err);
      }
      Auth.signOut();
    });
  };

  function onConfirm() {
    Alert.alert('Are you sure?', 'Deleting your user profile is permanent', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, delete',
        style: 'destructive',
        onPress: removeUser,
      },
    ]);
  }

  function onChangePhoto() {
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (!didCancel && !errorCode && assets?.length) {
          setSelectedPhoto(assets[0]);
        }
      },
    );
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || updateError || deleteError) {
    <ApiErrorMessage
      title="Error fetching or updating the user"
      message={error?.message || updateError?.message || deleteError?.message}
    />;
  }

  return (
    <View style={styles.page}>
      <Image
        source={{uri: selectedPhoto?.uri || user?.image || DEFAULT_USER_IMAGE}}
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
      <Text style={styles.textButtonDanger} onPress={onConfirm}>
        {deleteLoading ? 'Deleting...' : 'Delete'}
      </Text>
    </View>
  );
};

export default EditProfileScreen;
