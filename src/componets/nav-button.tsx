import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface NavButtonProps {
  onPress: () => void;
  title: string;
  position: 'left' | 'right';
}

export default (props: NavButtonProps) => {
  const positionStyle =
    props.position === 'left' ? style.leftButton : style.rightButton;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[style.common, positionStyle]}
    >
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  common: {
    justifyContent: 'center',
  },
  leftButton: {
    paddingLeft: 16,
  },
  rightButton: {
    alignItems: 'flex-end',
    paddingRight: 16,
  },
});
