import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import colors from '../../utils/colors';

export default () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.offBlack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
