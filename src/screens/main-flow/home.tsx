import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import sharedAuthService from '../../services/auth-service';

export default () => {
  return <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={() => sharedAuthService.logout()}>
      <Text>{'Logout'}</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue'
  }
})