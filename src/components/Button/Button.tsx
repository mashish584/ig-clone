import React from 'react';
import {View, Text, Pressable, StyleSheet, ViewStyle} from 'react-native';
import {colors, fonts} from '../FeedPost/styles';

interface IButton {
  text?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const Button = ({text = '', onPress = () => {}, style}: IButton) => {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
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
