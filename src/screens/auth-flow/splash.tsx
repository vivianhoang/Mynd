import React, { useEffect } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import sharedAuthService from '../../services/auth-service';
import colors from '../../utils/colors';

export default () => {
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // Run after animation or navigation system is mounted
      sharedAuthService.initialize();
    });
  }, []);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
