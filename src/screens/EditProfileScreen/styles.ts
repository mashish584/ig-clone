import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
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

export default styles;
