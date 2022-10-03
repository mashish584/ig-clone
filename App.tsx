import {Linking} from 'react-native';
import {Amplify} from 'aws-amplify';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import Navigation from './src/navigation';
import awsconfig from './src/aws-exports';
import {AuthContextProvider} from './src/context/AuthContext';
import Client from './src/apollo/Client';

const urlOpener = async (url: string, redirectUrl: string) => {
  await InAppBrowser.isAvailable();
  const response = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (response.type === 'success') {
    Linking.openURL(response.url);
  }
};

const updatedConfig = {
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    redriectSignIn: 'notjustphotos://',
    redirectSignOut: 'notjustphotos://',
    urlOpener,
  },
};

Amplify.configure(updatedConfig);

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
