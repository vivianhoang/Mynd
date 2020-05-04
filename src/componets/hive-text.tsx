import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps, Alert } from 'react-native';
import colors from '../utils/colors';

interface Props extends TextProps {
  children?: string | ReactNode;
  variant?: 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold';
}

const HiveText = (props: Props) => {
  const { children, style, variant } = props;
  let fontFamily = 'PulpDisplay-Regular';

  switch (variant) {
    case 'light':
      fontFamily = 'PulpDisplay-Light';
      break;
    case 'regular':
      fontFamily = 'PulpDisplay-Regular';
      break;
    case 'medium':
      fontFamily = 'PulpDisplay-Medium';
      break;
    case 'semi-bold':
      fontFamily = 'PulpDisplay-SemiBold';
      break;
    case 'bold':
      fontFamily = 'PulpDisplay-Bold';
      break;
  }

  return (
    <Text
      numberOfLines={4}
      style={[styles.textLabel as any, { fontFamily }, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textLabel: {
    color: colors.offBlack,
    fontSize: 16,
  },
});

export default HiveText;
