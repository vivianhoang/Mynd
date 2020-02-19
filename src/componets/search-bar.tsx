import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../utils/colors';

interface SearchBarProps {
  placeholder: string;
}

export default (props: SearchBarProps) => {
  const { placeholder } = props;
  return (
    <View style={styles.container}>
      <TextInput
        selectionColor={colors.salmonRed}
        placeholder={placeholder}
        placeholderTextColor={colors.lightPurple}
        style={styles.input}
      />
      <TouchableOpacity style={styles.iconContainer}>
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
    shadowOpacity: 0.15,
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
