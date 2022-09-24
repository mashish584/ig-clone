import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image} from 'react-native';

import HomeScreen from '../screens/HomScreen';
import {HomeStackNavigatorParamList} from './types';

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={HomeScreen}
        options={{headerTitle: HeaderTitle, headerTitleAlign: 'center'}}
      />
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
