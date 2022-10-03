import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';
import {useForm, Control, Controller} from 'react-hook-form';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import user from '../../assets/data/users.json';
import {colors, fonts} from '../../theme';
import {User} from '../../API';

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
  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);
  const {control, handleSubmit} = useForm<IEditableUser>({
    defaultValues: {
      name: user.name,
      username: user.username,
      website: user.website,
      bio: user.bio,
    },
  });

  function onSubmit(data: IEditableUser) {
    console.log('Submit', data);
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
        Submit
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
