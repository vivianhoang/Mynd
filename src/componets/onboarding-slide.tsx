import React from 'react';
import { ImageRequireSource, View, Image, StyleSheet } from 'react-native';
import HiveText from './hive-text';
import colors from '../utils/colors';
import { screenSize } from '../utils/layout';

export interface OnboardingSlideProps {
  imageBackground: ImageRequireSource;
  imageForeground: ImageRequireSource;
  title: string;
  description: string;
}

export default (props: OnboardingSlideProps) => {
  const { imageBackground, imageForeground, title, description } = props;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={imageBackground}
          style={[styles.image, { tintColor: colors.white, opacity: 0.75 }]}
          resizeMode={'contain'}
        />
        <Image
          source={imageForeground}
          style={styles.image}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.labelsContainer}>
        <HiveText style={styles.title} variant={'bold'}>
          {title}
        </HiveText>
        <HiveText style={styles.description} variant={'regular'}>
          {description}
        </HiveText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    width: screenSize.width,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: null,
    width: null,
  },
  labelsContainer: {
    minHeight: 180,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 30,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.85,
    textAlign: 'center',
  },
});
