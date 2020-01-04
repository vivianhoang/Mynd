import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';
import HiveTextInput from '../../componets/hive-text-input';
import { LoginProps } from '../../models';
import NavButton from '../../componets/nav-button';
import colors from '../../utils/colors';
import BigButton from '../../componets/big-button';
import HiveText from '../../componets/hive-text';

export default (props: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  props.navigation.setOptions({
    headerTitle: null,
    headerLeft: () => (
      <NavButton
        onPress={() => sharedNavigationService.goBack()}
        icon={'arrow-left'}
        position={'left'}
      />
    ),
    headerStyle: { shadowColor: 'transparent' },
  });

  return (
    <View style={styles.container}>
      <HiveText style={styles.headerLabel}>{'Enter Login'}</HiveText>
      <HiveTextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <HiveTextInput
        placeholder="Password"
        value={password}
        onChangeText={password => {
          setPassword(password);
        }}
      />
      <BigButton
        style={styles.button}
        onPress={async () => {
          try {
            await sharedAuthService.login(email, password);
            sharedNavigationService.navigate({ page: 'MainFlow' });
          } catch (error) {
            Alert.alert('Uh oh!', error.message);
          }
        }}
        title={'Login'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  headerLabel: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
  },
});
