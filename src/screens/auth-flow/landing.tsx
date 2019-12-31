import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import BigButton from '../../componets/big-button';

export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/logo.png')}
          resizeMode={'contain'}
        />
      </View>
      <BigButton
        title={'Login'}
        onPress={() => sharedNavigationService.navigate({ page: 'Login' })}
      />
      <View style={{ height: 8 }} />
      <BigButton
        title={'Signup'}
        type={'third'}
        onPress={() => sharedNavigationService.navigate({ page: 'Signup' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'flex-end',
    padding: 16,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 200,
  },
});
