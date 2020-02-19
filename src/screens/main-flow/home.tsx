import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  SectionList,
  ImageRequireSource,
} from 'react-native';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';

import {
  CategoriesById,
  HomeProps,
  ReduxState,
  Category,
  Ideas,
  HiveData,
  TemplateType,
} from '../../models';
import NavButton from '../../componets/nav-button';
import colors from '../../utils/colors';
import HiveText from '../../componets/hive-text';
import HiveTextInput from '../../componets/hive-text-input';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import SearchBar from '../../componets/search-bar';

const iconMap: { [key in TemplateType]: ImageRequireSource } = {
  Idea: require('../../assets/ideas-icon.png'),
  Todo: require('../../assets/checklist-icon.png'),
};

export default (props: HomeProps) => {
  const hiveData = useSelector<ReduxState, HiveData>(state => state.hiveData);
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
        <View style={{ paddingVertical: 16 }}>
          <SearchBar placeholder={'Search for something...'} />
        </View>
        <SectionList
          sections={hiveData}
          renderSectionHeader={({ section: { title } }) => {
            const sectionTitle = `${title}s`;
            const icon = iconMap[title as TemplateType];
            return (
              <View
                style={{
                  paddingBottom: 16,
                  paddingTop: 8,
                  backgroundColor: colors.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={icon}
                  style={{ height: 34, width: 34, marginRight: 12 }}
                  resizeMode={'contain'}
                />
                <HiveText variant={'bold'} style={{ fontSize: 30 }}>
                  {sectionTitle}
                </HiveText>
              </View>
            );
          }}
          renderItem={({ item }) => {
            console.log(item);
            return (
              <FlatList
                numColumns={3}
                data={[...item, ...item]}
                renderItem={({ item, index }) => {
                  let marginHorizontal = index % 3 == 1 ? 16 : 0;
                  return (
                    <View
                      style={{
                        height: (375 - 32) / 3,
                        width: (Dimensions.get('window').width - 64) / 3,
                        backgroundColor: colors.placeholderGray,
                        marginHorizontal,
                        marginBottom: 16,
                        borderRadius: 10,
                      }}
                    />
                  );
                }}
              />
            );
          }}
        ></SectionList>
        {/* <FlatList
          data={ideas}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => {
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
                    page: 'IdeaTemplate',
                    props: {
                      idea: item,
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
                  {item.title.toUpperCase()}
                </HiveText>
              </TouchableOpacity>
            );
          }}
        ></FlatList> */}
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.tabLabel}>
          <TouchableOpacity onPress={() => sharedAuthService.logout()}>
            <Image
              style={styles.tabIcon}
              source={require('../../assets/ellipsis-icon.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabLabel}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              sharedNavigationService.navigate({
                page: 'TemplateSelection',
              })
            }
          >
            <Image
              style={[
                styles.tabIcon,
                {
                  height: 80,
                  width: 80,
                  marginBottom: 8,
                },
              ]}
              source={require('../../assets/templates_button.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabLabel}>
          <TouchableOpacity>
            <Image
              style={styles.tabIcon}
              source={require('../../assets/user-icon.png')}
              resizeMode={'contain'}
            />
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
    paddingHorizontal: 16,
  },
  tabIcon: {
    height: 50,
    width: 50,
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
