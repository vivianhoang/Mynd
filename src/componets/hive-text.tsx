import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import colors from '../utils/colors';

interface Props extends TextProps {
  children?: string | ReactNode;
}

export default (props: Props) => {
  const { children, style } = props;
  return <Text style={[styles.textLabel as any, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  textLabel: {
    fontFamily: 'Helvetica',
    color: colors.offBlack,
  },
});
