import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import colors from '../utils/colors';
import { topSpace } from '../utils/layout';

interface DoneButtonProps {
  onPress: () => void;
}

const DoneButton = (props: DoneButtonProps) => {
  const { onPress } = props;
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'position', android: undefined })}
      keyboardVerticalOffset={44 + topSpace()}
    >
      <TouchableOpacity onPress={onPress} style={styles.saveButton}>
        <Image
          style={styles.doneIcon}
          source={require('../assets/check-icon.png')}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  doneIcon: {
    height: 44,
    width: 44,
    tintColor: colors.white,
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.honeyOrange,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.offBlack,
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
});

export default DoneButton;
