import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  numberContainer: {
    alignItems: 'center',
  },
  numberText: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.full,
    color: colors.black,
  },
  username: {
    fontWeight: fonts.weight.full,
    color: colors.black,
  },
  actionGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default styles;
