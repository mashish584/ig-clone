import {Linking} from 'react-native';
import {Amplify} from 'aws-amplify';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {MenuProvider} from 'react-native-popup-menu';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Navigation from './src/navigation';
import awsconfig from './src/aws-exports';
import {AuthContextProvider} from './src/context/AuthContext';
import Client from './src/apollo/Client';

dayjs.extend(relativeTime);

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
      <MenuProvider>
        <AuthContextProvider>
          <Client>
            <Navigation />
          </Client>
        </AuthContextProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;
