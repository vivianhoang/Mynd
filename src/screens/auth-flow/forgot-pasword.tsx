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
import { ForgotPasswordProps } from '../../models';
import NavButton from '../../componets/nav-button';
import colors from '../../utils/colors';
import BigButton from '../../componets/big-button';
import HiveText from '../../componets/hive-text';
import { topSpace } from '../../utils/layout';

export default (props: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');

  props.navigation.setOptions({
    headerTitle: null,
    headerLeft: () => (
      <NavButton
        onPress={() => sharedNavigationService.goBack()}
        icon={'back'}
        position={'left'}
      />
    ),
    headerStyle: { shadowColor: 'transparent' },
  });

  return (
    <View style={styles.container}>
      <HiveText style={styles.headerLabel}>{'Forgot Password?'}</HiveText>
      <HiveTextInput
        style={styles.input}
        title="EMAIL"
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
        autoFocus={true}
      />
      <View style={styles.fill} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'position', android: undefined })}
        keyboardVerticalOffset={44 + topSpace() + 16}
      >
        <BigButton
          style={styles.button}
          onPress={async () => {
            sharedNavigationService.navigate({ page: 'Loader' });
            try {
              await sharedAuthService.forgotPassword(email);
              sharedNavigationService.navigate({
                page: 'Login',
              });
              Alert.alert(`A reset email has been sent to ${email}.`);
            } catch (error) {
              sharedNavigationService.navigate({ page: 'ForgotPassword' });
              Alert.alert('Uh oh!', error.message);
            }
          }}
          title={'Submit'}
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
    paddingTop: 16,
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
