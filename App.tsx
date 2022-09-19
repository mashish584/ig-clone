import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from './src/theme/colors';
import fonts from './src/theme/fonts';

const App = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text style={{color: colors.primary, fontSize: fonts.size.lg}}>
        Hello World
        <AntDesign name="stepforward" />
      </Text>
    </View>
  );
};

export default App;
