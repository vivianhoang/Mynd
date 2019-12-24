import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import sharedNavigationService from '../../services/navigation-service';

export default () => {
  return <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={() => sharedNavigationService.navigate('Login')}>
      <Text>{'Login'}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => sharedNavigationService.navigate('Signup')}>
      <Text>{'Signup'}</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'flex-end',
  },
  button: {
    height: 50,
    marginBottom: 16,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }
})