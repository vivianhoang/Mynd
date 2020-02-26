import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import colors from '../utils/colors';
import * as _ from 'lodash';

interface SearchBarProps extends TextInputProps {
  onDismiss: () => void;
}

export default (props: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        selectionColor={colors.salmonRed}
        placeholderTextColor={colors.lightPurple}
        style={styles.input}
        {...props}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={props.onDismiss}>
        <Image
          style={styles.clearIcon}
          source={require('../assets/clear-icon.png')}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    shadowColor: colors.offBlack,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  input: {
    flex: 1,
    fontFamily: 'PulpDisplay-Medium',
    fontSize: 18,
    color: colors.offBlack,
    paddingLeft: 4,
  },
  iconContainer: {
    justifyContent: 'center',
  },
  clearIcon: {
    height: 32,
    width: 32,
    tintColor: colors.lightPurple,
  },
});
