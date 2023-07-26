import {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {Auth} from 'aws-amplify';

import Logo from '../../../assets/images/logo.png';
import FormInput from '../components/FormInput';
import CustomButton from '../components/CustomButton';
import SocialSignInButtons from '../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {SignInNavigationProp} from '../../../types/navigation';
import {useAuthContext} from '../../../contexts/AuthContext';

type SignInData = {
  email: string;
  password: string;
};

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation<SignInNavigationProp>();

  const {control, handleSubmit, reset} = useForm<SignInData>();

  const [loading, setLoading] = useState(false);
  const {setUser} = useAuthContext();

  const onSignInPressed = async ({email, password}: SignInData) => {
    if (loading) return;

    try {
      setLoading(true);
      const cognitoUser = await Auth.signIn(email, password);
      setUser(cognitoUser);
    } catch (e) {
      if ((e as Error).name === 'UserNotConfirmedException') {
        navigation.navigate('Confirm email', {email});
      } else {
        Alert.alert('Oops', (e as Error).message);
      }
    } finally {
      setLoading(false);
      reset();
    }
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('Forgot password');
  };

  const onSignUpPress = () => {
    navigation.navigate('Sign up');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />

        <FormInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
          }}
        />

        <FormInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 3,
              message: 'Password should be minimum 3 characters long',
            },
          }}
        />

        <CustomButton
          text={loading ? 'Sign In...' : 'Sign In'}
          onPress={handleSubmit(onSignInPressed)}
        />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;
