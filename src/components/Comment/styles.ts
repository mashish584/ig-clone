import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import font from '../../theme/fonts';

const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    color: colors.black,
    flex: 1,
    lineHeight: 18,
  },
  bold: {
    fontWeight: font.weight.bold,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default styles;
export {colors, font};
