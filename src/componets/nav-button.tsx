import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageRequireSource,
} from 'react-native';
import HiveText from './hive-text';
import colors from '../utils/colors';

interface IconOptions {
  [key: string]: ImageRequireSource;
}

const icons: IconOptions = {
  back: require('../assets/back-icon.png'),
  subMenu: require('../assets/ellipsis-icon.png'),
};

export interface NavButtonProps {
  onPress: () => void;
  title?: string;
  icon?: 'back' | 'subMenu';
  position: 'left' | 'right';
  color?: string;
  isDisabled?: boolean;
}

export default (props: NavButtonProps) => {
  const { position, onPress, title, icon, color, isDisabled } = props;
  const positionStyle =
    position === 'left' ? styles.leftButton : styles.rightButton;
  const content = title ? (
    <HiveText
      style={[
        styles.label,
        {
          color: color || colors.offBlack,
        },
      ]}
    >
      {props.title}
    </HiveText>
  ) : icon ? (
    <Image
      source={icons[icon]}
      style={[styles.icon, { tintColor: color || colors.offBlack }]}
    />
  ) : null;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.common, positionStyle]}
      disabled={isDisabled}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  common: {
    justifyContent: 'center',
  },
  leftButton: {
    paddingLeft: 16,
  },
  rightButton: {
    alignItems: 'flex-end',
    paddingRight: 16,
    height: 36,
    width: 36,
    marginLeft: 8,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
  },
  icon: {
    height: 44,
    width: 44,
  },
});
