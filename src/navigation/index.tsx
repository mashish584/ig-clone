import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CommentsScreen from '../screens/CommentsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import {RootNavigatorParamList} from '../types/navigation';
import AuthStackNavigator from './AuthStackNavigator';
import {useAuthContext} from '../contexts/AuthContext';
import {ActivityIndicator, View} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/client';
import {getUser} from './queries';
import {GetUserQuery, GetUserQueryVariables} from '../API';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import {useEffect} from 'react';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const linking: LinkingOptions<RootNavigatorParamList> = {
  prefixes: ['notjustphotos://', 'https://notjustphotos.com'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Comments: 'comments',
      Home: {
        screens: {
          HomeStack: {
            initialRouteName: 'Feed',
            screens: {
              UserProfile: 'user/:userId',
            },
          },
        },
      },
    },
  },
};

const Navigation = () => {
  let stackScreens = null;
  const {user, userId} = useAuthContext();
  const [fetchUserInfo, {data, loading}] = useLazyQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(getUser);
  const userData = data?.getUser;

  useEffect(() => {
    if (userId) {
      fetchUserInfo({variables: {id: userId}});
    }
  }, [userId]);

  if (user === undefined || loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    stackScreens = (
      <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{headerShown: false}}
      />
    );
  } else if (!userData?.username) {
    stackScreens = (
      <Stack.Screen
        name="ProfileSetup"
        component={EditProfileScreen}
        options={{headerTitle: 'Setup Profile'}}
      />
    );
  } else {
    stackScreens = (
      <>
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Comments" component={CommentsScreen} />
      </>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: true,
        }}>
        {stackScreens}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
