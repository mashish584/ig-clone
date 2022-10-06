import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

export default StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  textButton: {
    color: colors.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  textButtonDanger: {
    color: colors.accent,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  label: {
    width: 80,
  },
  input: {
    borderColor: colors.border,
    borderBottomWidth: 1,
    minHeight: 50,
  },
});
