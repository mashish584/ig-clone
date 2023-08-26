import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CameraScreen} from '../screens/CameraScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import {PostUploadNavigatorParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<PostUploadNavigatorParamList>();

const PostUploadStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="UploadPost" component={CreatePostScreen} />
    </Stack.Navigator>
  );
};

export default PostUploadStackNavigator;
