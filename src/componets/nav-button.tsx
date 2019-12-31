import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import HiveText from './hive-text';

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
      <HiveText style={style.label}>{props.title}</HiveText>
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
  label: {
    fontSize: 18,
  },
});
