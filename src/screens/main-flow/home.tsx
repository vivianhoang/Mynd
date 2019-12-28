import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';
import { useSelector } from 'react-redux';

import { Categories, HomeProps, ReduxState } from '../../models';

export default (props: HomeProps) => {
  const categoryList = useSelector<ReduxState, Categories>(
    state => state.categories,
  );

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.navigate('CreateNote');
        }}
      >
        <Text>{'Add'}</Text>
      </TouchableOpacity>
    ),
  });

  console.log('RE RENDER HOME, TODO, MEMOIZE USE SELECTOR');

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryList}
        keyExtractor={category => category.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ height: 50, backgroundColor: 'red' }}
            onPress={() => {
              sharedNavigationService.navigate('CategoryFlow');
            }}
          >
            <Text>{item.title}</Text>
            <Text>{item.count}</Text>
          </TouchableOpacity>
        )}
      ></FlatList>
      <TouchableOpacity
        style={styles.button}
        onPress={() => sharedAuthService.logout()}
      >
        <Text>{'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});
