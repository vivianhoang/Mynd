import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import BigButton from '../../componets/big-button';
import HiveText from '../../componets/hive-text';
import colors from '../../utils/colors';

export default () => {
  return (
    <>
      <ImageBackground
        source={require('../../assets/landing_screen.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')}
            resizeMode={'contain'}
          />
          <View style={styles.labelContainer}>
            <HiveText style={styles.title}>{'MYND'}</HiveText>
            <HiveText style={styles.subtitle}>
              {'Your mind in one place'}
            </HiveText>
          </View>
          <View style={styles.actionsContainer}>
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
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingVertical: 44 + 16,
  },
  labelContainer: {},
  title: {
    fontSize: 60,
    color: colors.white,
    fontFamily: 'PulpDisplay-Bold',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'PulpDisplay-Bold',
    color: colors.offBlack,
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logo: {
    height: 75,
    width: 75,
    alignSelf: 'flex-end',
    paddingBottom: 16,
    opacity: 0,
  },
  background: {
    flex: 1,
  },
});
