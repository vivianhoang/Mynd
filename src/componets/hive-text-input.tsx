import React, { ReactNode, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../utils/colors';
import * as _ from 'lodash';
import HiveText from './hive-text';

interface Props extends TextInputProps {
  title: string;
  secureText?: boolean;
  showIcon?: boolean;
}

const HiveTextInput = (props: Props) => {
  const [viewPassword, setViewPassword] = useState(true);
  const { style, title, showIcon, secureText } = props;
  const finalProps = _.omit(props, 'style');
  const viewPasswordIcon = viewPassword
    ? require('../assets/hide-icon.png')
    : require('../assets/show-icon.png');

  const iconView = showIcon ? (
    <TouchableOpacity
      style={styles.eyeIconContainer}
      onPress={() => setViewPassword(!viewPassword)}
    >
      <Image style={styles.titleIcon} source={viewPasswordIcon} />
    </TouchableOpacity>
  ) : null;

  return (
    <View>
      <HiveText style={styles.titleLabel}>{title}</HiveText>
      <View style={styles.textInputContainer}>
        <TextInput
          selectionColor={colors.salmonRed}
          style={[styles.textInput as any, style]}
          {...finalProps}
          secureTextEntry={secureText ? viewPassword : false}
        />
        {iconView}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleLabel: {
    color: colors.lightPurple,
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 14,
    marginTop: 8,
  },
  textInput: {
    fontFamily: 'PulpDisplay-Regular',
    color: colors.offBlack,
    fontSize: 18,
    margin: 0,
    padding: 0,
    paddingRight: 8,
    flex: 1,
  },
  textInputContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  titleIcon: {
    height: 44,
    width: 44,
  },
  eyeIconContainer: {
    marginLeft: 8,
    marginBottom: 8,
  },
});

export default HiveTextInput;
