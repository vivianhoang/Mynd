import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import colors from '../utils/colors';
import HiveText from '../componets/hive-text';
import LinearGradient from 'react-native-linear-gradient';
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
  let gradientColors = [colors.honeyOrange, colors.honeyYellow];
  if (type) {
    switch (type) {
      case 'second':
        {
          gradientColors = [colors.white, colors.white];
          finalButtonStyle.backgroundColor = colors.white;
          finalTextStyle.color = color || defaultButtonColor;
        }
        break;
      case 'third':
        {
          finalButtonStyle.backgroundColor = 'transparent';
          finalButtonStyle.borderColor = colors.white;
          finalTextStyle.color = color || defaultButtonColor;
          finalButtonStyle.borderWidth = 2;
          gradientColors = ['transparent', 'transparent'];
        }
        break;
      default:
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={[finalButtonStyle, style as any]}
        start={{ x: 0, y: -5 }}
        end={{ x: 1, y: 5 }}
        colors={gradientColors}
      >
        <HiveText style={finalTextStyle} variant={'bold'}>
          {title}
        </HiveText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: 30,
    backgroundColor: defaultButtonColor,
    borderColor: defaultButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 20,
    color: colors.white,
  },
});
