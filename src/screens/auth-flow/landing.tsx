import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  ImageRequireSource,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import BigButton from '../../componets/big-button';
import HiveText from '../../componets/hive-text';
import colors from '../../utils/colors';
import { ScrollView } from 'react-native-gesture-handler';
import OnboardingSlide from '../../componets/onboarding-slide';
import { screenSize } from '../../utils/layout';

interface OnboardingSlideData {
  imageBackground: ImageRequireSource;
  imageForeground: ImageRequireSource;
  title: string;
  description: string;
}

const onboardingSlideData: OnboardingSlideData[] = [
  {
    imageBackground: require('../../assets/bee-thoughts-background.png'),
    imageForeground: require('../../assets/bee-thoughts.png'),
    title: 'Stay Focused',
    description: `Sometimes, there's too much to think about. We're here to make that easy for you.`,
  },
  {
    imageBackground: require('../../assets/bee-notes-background.png'),
    imageForeground: require('../../assets/bee-notes.png'),
    title: 'Short, But Sweet',
    description:
      'Quickly write down ideas and things you need to do. Track your progress and watch your Hive grow.',
  },
  {
    imageBackground: require('../../assets/bee-hive-background.png'),
    imageForeground: require('../../assets/bee-hive.png'),
    title: 'Stick Your Thoughts Somewhere Safe',
    description: `Revist your thoughts you've saved in the Hive. Get inspired on the go and never forget again.`,
  },
];

export default () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / screenSize.width);
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/landing_screen.png')}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <ScrollView
              horizontal={true}
              snapToAlignment={'center'}
              pagingEnabled
              decelerationRate={0}
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
              onScrollEndDrag={onScrollEnd}
              onMomentumScrollEnd={onScrollEnd}
            >
              <View style={styles.labelContainer}>
                <HiveText style={styles.title} variant={'bold'}>
                  {'MYND'}
                </HiveText>
                <HiveText style={styles.subtitle}>
                  {'Your mind in one place'}
                </HiveText>
              </View>
              {onboardingSlideData.map(onboardingSlide => {
                return (
                  <OnboardingSlide
                    imageBackground={onboardingSlide.imageBackground}
                    imageForeground={onboardingSlide.imageForeground}
                    title={onboardingSlide.title}
                    description={onboardingSlide.description}
                    key={onboardingSlide.title}
                  />
                );
              })}
            </ScrollView>
            <View style={styles.actionsContainer}>
              <View style={styles.indicatorContainer}>
                <View
                  style={[
                    styles.indicator,
                    { opacity: currentIndex == 0 ? 1 : 0.4 },
                  ]}
                />
                {onboardingSlideData.map((onboardingSlide, index) => {
                  const correctedIndex = index + 1;
                  return (
                    <View
                      style={[
                        styles.indicator,
                        { opacity: currentIndex == correctedIndex ? 1 : 0.4 },
                      ]}
                      key={onboardingSlide.title}
                    />
                  );
                })}
              </View>
              <BigButton
                title={'Login'}
                type={'second'}
                onPress={() =>
                  sharedNavigationService.navigate({ page: 'Login' })
                }
              />
              <View style={{ height: 16 }} />
              <BigButton
                title={'Signup'}
                type={'third'}
                color={colors.white}
                onPress={() =>
                  sharedNavigationService.navigate({ page: 'Signup' })
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {
    width: screenSize.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    color: colors.white,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.offBlack,
    alignSelf: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  actionsContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  background: {
    flex: 1,
  },
});
