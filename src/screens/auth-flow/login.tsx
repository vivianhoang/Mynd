import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={password => {
          setPassword(password);
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            await sharedAuthService.login(email, password);
            sharedNavigationService.navigate({ page: 'MainFlow' });
          } catch (error) {
            Alert.alert('Uh oh!', error.message);
          }
        }}
      >
        <Text>{'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
