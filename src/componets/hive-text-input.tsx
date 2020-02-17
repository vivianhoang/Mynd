import React, { ReactNode } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import colors from '../utils/colors';
import * as _ from 'lodash';
import HiveText from './hive-text';

interface Props extends TextInputProps {
  title: string;
}

export default (props: Props) => {
  const { style, title } = props;
  const finalProps = _.omit(props, 'style');

  return (
    <View>
      <HiveText style={styles.titleLabel}>{title}</HiveText>
      <TextInput
        placeholderTextColor={colors.darkGray}
        selectionColor={colors.salmonRed}
        style={[styles.textInput as any, style]}
        {...finalProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleLabel: {
    color: colors.lightPurple,
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 14,
  },
  textInput: {
    fontFamily: 'PulpDisplay-Regular',
    color: colors.offBlack,
    fontSize: 18,
    margin: 0,
    padding: 0,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingRight: 8,
  },
});
