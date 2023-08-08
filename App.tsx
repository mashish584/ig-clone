import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Amplify} from 'aws-amplify';

import config from './src/aws-exports';
import Navigation from './src/navigation';
import AuthContextProvider from './src/contexts/AuthContext';
import Client from './src/apollo/Client';

Amplify.configure(config);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <Client>
          <Navigation />
        </Client>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
