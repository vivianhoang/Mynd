import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
      <HiveText style={styles.headerLabel}>{'Login'}</HiveText>
      <HiveTextInput
        style={styles.input}
        title="USERNAME OR EMAIL"
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
        autoFocus={true}
      />
      <HiveTextInput
        title="PASSWORD"
        value={password}
        onChangeText={password => {
          setPassword(password);
        }}
      />
      <View style={styles.fill} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'position', android: undefined })}
        keyboardVerticalOffset={44 + 44 + 16}
      >
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 32,
  },
  fill: {
    flex: 1,
  },
  headerLabel: {
    color: colors.offBlack,
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
});
