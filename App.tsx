import {Amplify} from 'aws-amplify';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {withAuthenticator, AmplifyTheme} from 'aws-amplify-react-native';

import Navigation from './src/navigation';
import awsconfig from './src/aws-exports';
import {colors} from './src/theme';
import {AuthContextProvider} from './src/context/AuthContext';

Amplify.configure(awsconfig);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
