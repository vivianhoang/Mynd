import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';

import { CategoriesById, HomeProps, ReduxState } from '../../models';

export default (props: HomeProps) => {
  const categoriesById = useSelector<ReduxState, CategoriesById>(
    state => state.categoriesById,
  );

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.navigate({ page: 'CreateNote' });
        }}
      >
        <Text>{'Add'}</Text>
      </TouchableOpacity>
    ),
    headerTitle: () => (
      <Image
        style={styles.logo}
        source={require('../../assets/logo.png')}
        resizeMode={'contain'}
      />
    ),
  });

  console.log('RE RENDER HOME, TODO, MEMOIZE USE SELECTOR');

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(categoriesById)}
        keyExtractor={id => id}
        renderItem={({ item }) => {
          const category = categoriesById[item];
          return (
            <TouchableOpacity
              style={{ height: 50, backgroundColor: 'red' }}
              onPress={() => {
                sharedNavigationService.navigate({
                  page: 'CategoryFlow',
                  props: {
                    categoryId: item,
                  },
                });
              }}
            >
              <Text>{category.title}</Text>
            </TouchableOpacity>
          );
        }}
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
  logo: {
    height: 44,
    width: 44,
  },
});
