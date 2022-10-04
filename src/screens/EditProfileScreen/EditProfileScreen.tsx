import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useForm, Control, Controller} from 'react-hook-form';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useMutation, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';

import ApiErrorMessage from '../../components/ApiErrorMessage';

import {colors, fonts} from '../../theme';
import {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  GetUserQuery,
  GetUserQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  User,
} from '../../API';

import {deleteUser, getUser, updateUser} from './query';
import {useAuthContext} from '../../context/AuthContext';

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

type IEditableUser = Pick<
  User,
  'name' | 'email' | 'username' | 'bio' | 'website'
>;

interface ICustomInput {
  label: string;
  name: keyof IEditableUser;
  control: Control<IEditableUser, object>;
  rules?: object;
  multiline?: boolean;
}

const CustomInput = (props: ICustomInput) => {
  const {label, multiline, name, control, rules} = props;
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value || ''}
                placeholder={label}
                style={[
                  styles.input,
                  {borderColor: error?.type ? colors.accent : colors.border},
                ]}
                multiline={multiline}
                autoCapitalize="none"
              />
              {error?.type && (
                <Text style={{color: colors.accent}}>
                  {error.message || 'Enter a valid value.'}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);
  const {control, handleSubmit, setValue} = useForm<IEditableUser>({});
  const {userId, user: authUser} = useAuthContext();

  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );

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
    navigation.goBack();
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
        source={{uri: selectedPhoto?.uri || user.image}}
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

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  textButton: {
    color: colors.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  textButtonDanger: {
    color: colors.accent,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  label: {
    width: 80,
  },
  input: {
    borderColor: colors.border,
    borderBottomWidth: 1,
    minHeight: 50,
  },
});

export default EditProfileScreen;
