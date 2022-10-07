import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image} from 'react-native';

import HomeScreen from '../screens/HomScreen';
import PostLikesScreen from '../screens/PostLikesScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import UpdatePostScreen from '../screens/UpdatePostScreen/UpdatePostScreen';
import {HomeStackNavigatorParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={HomeScreen}
        options={{headerTitle: HeaderTitle, headerTitleAlign: 'center'}}
      />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
      <Stack.Screen name="UpdatePost" component={UpdatePostScreen} />
      <Stack.Screen name="PostLikes" component={PostLikesScreen} />
    </Stack.Navigator>
  );
};

const HeaderTitle = () => {
  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={{width: 150, height: 40}}
      resizeMode="contain"
    />
  );
};

export default HomeStackNavigator;
