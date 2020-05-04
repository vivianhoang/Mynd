import { Dimensions, Platform } from 'react-native';
export const screenSize = Dimensions.get('window');

export function isIphoneX() {
  const dim = Dimensions.get('window');

  return (
    // This has to be iOS
    Platform.OS === 'ios' &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
}

export function isIPhoneXSize(dim) {
  return dim.height == 812 || dim.width == 812;
}

export function isIPhoneXrSize(dim) {
  return dim.height == 896 || dim.width == 896;
}

export function topSpace() {
  return isIphoneX() ? 44 : 20;
}

export function bottomSpace() {
  return isIphoneX() ? 32 : 0;
}
