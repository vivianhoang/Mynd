import React, { ReactNode } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import colors from '../utils/colors';
import * as _ from 'lodash';

interface Props extends TextInputProps {}

export default (props: Props) => {
  const { style } = props;
  const finalProps = _.omit(props, 'style');

  return (
    <TextInput
      placeholderTextColor={colors.darkGray}
      style={[styles.textInput as any, style]}
      {...finalProps}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'Helvetica',
    color: colors.offBlack,
    fontSize: 18,
    margin: 0,
    padding: 0,
    backgroundColor: colors.lightGray,
    height: 50,
    borderRadius: 4,
    paddingLeft: 16,
    paddingRight: 8,
  },
});
