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
  // props.navigation.setOptions({
  //   headerTitle: () => (
  //     <Image
  //       style={styles.logo}
  //       source={require('../../assets/logo.png')}
  //       resizeMode={'contain'}
  //     />
  //   ),
  // });

  console.log('RE RENDER HOME, TODO, MEMOIZE USE SELECTOR');

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <HiveTextInput title={null} style={styles.searchInput} placeholder={'Search...'} />
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
      ></FlatList> */}
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.tabLabel}>
          <TouchableOpacity onPress={() => sharedAuthService.logout()}>
            <Icon name={'log-out'} color={colors.offBlack} size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.tabLabel}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              sharedNavigationService.navigate({
                page: 'TemplateSelectionFlow',
              })
            }
          >
            <Image
              style={styles.navBarButton}
              source={require('../../assets/templates_button.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabLabel}>
          <TouchableOpacity>
            <Icon name={'user'} color={colors.offBlack} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  navBarButton: {
    height: 80,
    width: 80,
    marginBottom: 8,
  },
  tabContainer: {
    height: 50 + 32,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    paddingBottom: 32,
    flexDirection: 'row',
  },
  tabLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
