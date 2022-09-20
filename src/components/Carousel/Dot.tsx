import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme';

interface IDot {
  isActive: boolean;
}

const Dot = ({isActive}: IDot) => {
  return (
    <View
      style={{
        ...style.dot,
        backgroundColor: isActive ? colors.primary : colors.white,
      }}
    />
  );
};

const style = StyleSheet.create({
  dot: {
    borderRadius: 5,
    marginHorizontal: 5,
    width: 10,
    aspectRatio: 1,
  },
});

export default Dot;
