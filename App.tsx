import {StyleSheet, View} from 'react-native';

import HomeScreen from './src/screens/HomScreen';
import CommentsScreen from './src/screens/CommentsScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';

const App = () => {
  return (
    <View style={styles.app}>
      {/* <CommentsScreen includeDetails={true} /> */}
      {/* <HomeScreen /> */}
      <ProfileScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

export default App;
