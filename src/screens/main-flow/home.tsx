import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';

import { CategoriesById, HomeProps, ReduxState, Category } from '../../models';
import NavButton from '../../componets/nav-button';
import colors from '../../utils/colors';
import HiveText from '../../componets/hive-text';
import HiveTextInput from '../../componets/hive-text-input';
import Icon from 'react-native-vector-icons/Feather';

export default (props: HomeProps) => {
  const categoriesById = useSelector<ReduxState, CategoriesById>(
    state => state.categoriesById,
  );
  let sortedCategories: Category[] = [];

  Object.keys(categoriesById).forEach(id => {
    sortedCategories.push(categoriesById[id]);
  });

  sortedCategories.sort(function(categoryA, categoryB) {
    const categoryAText = categoryA.title.toUpperCase();
    const categoryBText = categoryB.title.toUpperCase();
    return categoryAText < categoryBText
      ? -1
      : categoryAText > categoryBText
      ? 1
      : 0;
  });

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.logo}
        source={require('../../assets/logo.png')}
        resizeMode={'contain'}
      />
    ),
    headerLeft: () => (
      <NavButton
        onPress={() => sharedAuthService.logout()}
        icon={'log-out'}
        position={'left'}
      />
    ),
  });

  console.log('RE RENDER HOME, TODO, MEMOIZE USE SELECTOR');

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedCategories}
        ListHeaderComponent={() => (
          <HiveTextInput style={styles.searchInput} placeholder={'Search...'} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{ padding: 16 }}
        numColumns={2}
        renderItem={({ item, index }) => {
          const category = categoriesById[item.id];
          const isLeft = index % 2 == 0;
          return (
            <TouchableOpacity
              style={[
                styles.categoryCard,
                {
                  marginLeft: isLeft ? 0 : 4,
                  marginRight: isLeft ? 8 : 4,
                },
              ]}
              onPress={() => {
                sharedNavigationService.navigate({
                  page: 'CategoryFlow',
                  props: {
                    categoryId: item.id,
                  },
                });
              }}
            >
              <View style={styles.cardBackground} />
              <Image
                source={require('../../assets/honey-comb.png')}
                style={styles.cardBackgroundImage}
                resizeMode={'cover'}
              />
              <HiveText numberOfLines={1} style={styles.cardLabel}>
                {category.title.toUpperCase()}
              </HiveText>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.navigate({ page: 'CreateNote' });
        }}
        style={styles.addButton}
      >
        <Icon name={'edit-3'} color={colors.offBlack} size={26} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logo: {
    height: 44,
    width: 44,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.honeyOrange,
    borderRadius: 8,
    opacity: 0.75,
  },
  cardBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
    height: null,
    width: null,
  },
  categoryCard: {
    height: 100,
    justifyContent: 'flex-end',
    padding: 16,
    flex: 1,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  searchInput: {
    marginBottom: 16,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    height: 60,
    width: 60,
    borderRadius: 999,
    backgroundColor: colors.honeyOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
