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
    lineHeight: 18,
  },
  bold: {
    fontWeight: font.weight.bold,
  },
  icon: {
    marginHorizontal: 5,
  },
  avatar: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  middleColumn: {
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
  },
  footerText: {
    marginRight: 5,
  },
  newContainer: {
    marginRight: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  newLabel: {
    fontSize: 10,
    color: colors.white,
  },
});

export default styles;
export {colors, font};
