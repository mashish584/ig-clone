import {Amplify} from 'aws-amplify';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Navigation from './src/navigation';
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);

const App = () => {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
