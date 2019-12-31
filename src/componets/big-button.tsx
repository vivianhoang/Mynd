import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import colors from '../utils/colors';
import HiveText from '../componets/hive-text';
const defaultButtonColor = colors.honeyOrange;

interface Props {
  color?: string;
  title: string;
  onPress: () => void;
  type?: `second` | 'third';
  style?: StyleProp<ViewStyle>;
}

export default (props: Props) => {
  const { title, onPress, type, color, style } = props;

  let finalButtonStyle = { ...styles.button };
  let finalTextStyle = { ...styles.buttonLabel };
  if (type) {
    switch (type) {
      case 'second':
        {
          finalButtonStyle.backgroundColor = 'transparent';
          finalTextStyle.color = color || defaultButtonColor;
        }
        break;
      case 'third':
        {
          finalButtonStyle.backgroundColor = 'transparent';
          finalButtonStyle.borderColor = 'transparent';
          finalTextStyle.color = color || defaultButtonColor;
        }
        break;
      default:
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[finalButtonStyle, style as any]}
    >
      <HiveText style={finalTextStyle}>{title}</HiveText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: defaultButtonColor,
    borderColor: defaultButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
});
