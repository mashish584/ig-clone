import {Pressable} from 'react-native';
import React from 'react';

interface IDoublePressable {
  onDoublePress?: () => void;
  duration?: number;
  children: React.ReactNode;
}

const DoublePress = ({onDoublePress, children, duration}: IDoublePressable) => {
  let lastTap = 0;

  function handleDoublePress() {
    const now = Date.now();
    const timeGap = duration || 1000;
    if (now - lastTap < timeGap) {
      onDoublePress?.();
    }
    lastTap = now;
  }
  return <Pressable onPress={handleDoublePress}>{children}</Pressable>;
};

export default DoublePress;
