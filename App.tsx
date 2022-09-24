// import HomeScreen from './src/screens/HomScreen';
// import CommentsScreen from './src/screens/CommentsScreen';
// import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
// import EditProfileScreen from './src/screens/EditProfileScreen/EditProfileScreen';
// import PostUploadScreen from './src/screens/PostUploadScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
