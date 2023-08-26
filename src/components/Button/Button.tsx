import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, fonts} from '../FeedPost/styles';

interface IButton {
  text?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button = ({
  text = '',
  onPress = () => {},
  style,
  textStyle,
  disabled,
}: IButton) => {
  return (
    <Pressable
      style={[styles.container, disabled && {opacity: 0.5}, style]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontWeight: fonts.weight.semi,
  },
});

export default Button;
