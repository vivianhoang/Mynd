import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import HiveText from './hive-text';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../utils/colors';

export interface NavButtonProps {
  onPress: () => void;
  title?: string;
  icon?: string;
  position: 'left' | 'right';
  color?: string;
}

export default (props: NavButtonProps) => {
  const { position, onPress, title, icon, color } = props;
  const positionStyle =
    position === 'left' ? style.leftButton : style.rightButton;
  const content = title ? (
    <HiveText
      style={[
        style.label,
        {
          color: color || colors.offBlack,
        },
      ]}
    >
      {props.title}
    </HiveText>
  ) : icon ? (
    <Icon name={icon} size={26} color={color || colors.offBlack} />
  ) : null;
  return (
    <TouchableOpacity onPress={onPress} style={[style.common, positionStyle]}>
      {content}
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
