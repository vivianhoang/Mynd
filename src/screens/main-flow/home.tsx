import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SectionList,
  SafeAreaView,
  ImageRequireSource,
  ActivityIndicator,
} from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import { ReduxState, HiveData, TemplateType, TemplateData } from '../../models';
import colors from '../../utils/colors';
import HiveText from '../../componets/hive-text';
import SearchBar from '../../componets/search-bar';
// import sharedGeoNotificationService from '../../services/geo-notification';
import { screenSize, topSpace } from '../../utils/layout';

const iconMap: { [key in TemplateType]: ImageRequireSource } = {
  Idea: require('../../assets/ideas-icon.png'),
  Checklist: require('../../assets/checklist-icon.png'),
};

export default () => {
  const hiveData = useSelector<ReduxState, HiveData>(state => state.hiveData);
  const [searchText, setSearchText] = useState('');

  if (hiveData == undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color={colors.offBlack} />
      </View>
    );
  }

  // const isNetworkConnectedQuery = undefined;
  // const networkConnectedRef = useRef(isNetworkConnectedQuery);

  // useEffect(() => {
  //   if (isNetworkConnectedQuery === networkConnectedRef.current) {
  //     return;
  //   }
  //   networkConnectedRef.current = isNetworkConnectedQuery;
  //   console.log('Do something');
  // }, [isNetworkConnectedQuery]);

  const filterHiveData = () => {
    const finalHiveData = hiveData.reduce((data, value) => {
      const clonedValue = _.cloneDeep(value);

      clonedValue.data[0] = clonedValue.data[0].filter(templateData => {
        if (templateData.type == 'Checklist') {
          return (
            _.includes(
              templateData.title.toLowerCase(),
              searchText.toLowerCase(),
            ) ||
            !!templateData.items.filter(item => {
              return _.includes(
                item.title.toLowerCase(),
                searchText.toLowerCase(),
              );
            }).length
          );
        } else if (templateData.type == 'Idea') {
          return (
            _.includes(
              templateData.title.toLowerCase(),
              searchText.toLowerCase(),
            ) ||
            _.includes(
              templateData.description.toLowerCase(),
              searchText.toLowerCase(),
            )
          );
        }
      });
      if (clonedValue.data[0].length) {
        data.push(clonedValue);
      }
      return data;
    }, [] as HiveData);
    return finalHiveData;
  };

  const finalHiveData = filterHiveData();

  const zeroDataView = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={require('../../assets/zero-data.png')}
          style={{ width: screenSize.width, height: screenSize.width }}
        />
        <HiveText
          style={{ fontSize: 30, textAlign: 'center', marginBottom: 8 }}
          variant={'bold'}
        >
          {'Your hive is empty!'}
        </HiveText>
        <HiveText style={{ fontSize: 20, textAlign: 'center' }}>
          {'Start building your hive here'}
        </HiveText>
        <View style={{ flex: 1 }}></View>
        <Image
          style={{ height: 100, width: 100, marginBottom: 24 }}
          source={require('../../assets/arrow-icon.png')}
        />
      </View>
    );
  };

  // useEffect(() => {
  //   sharedGeoNotificationService.initialize();
  // }, []);

  const resultsView =
    hiveData.length && !finalHiveData.length ? (
      <HiveText style={styles.noResultsLabel}>{'No results.'}</HiveText>
    ) : (
      <SectionList
        sections={finalHiveData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => {
          return `section-${item[0].id}`;
        }}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'handled'}
        renderSectionHeader={({ section: { title } }) => {
          const sectionTitle = `${title}s`;
          const icon = iconMap[title as TemplateType];
          return (
            <View style={styles.headerContainer}>
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
          return (
            <FlatList
              numColumns={3}
              data={[...item]}
              keyExtractor={item => {
                return item.id;
              }}
              renderItem={({
                item,
                index,
              }: {
                item: TemplateData;
                index: number;
              }) => {
                let marginHorizontal = index % 3 == 1 ? 16 : 0;
                return (
                  <TouchableOpacity
                    style={{
                      height: (375 - 32) / 3,
                      width: (screenSize.width - 64) / 3,
                      backgroundColor: colors.placeholderGray,
                      marginHorizontal,
                      marginBottom: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: 12,
                    }}
                    onPress={() => {
                      switch (item.type) {
                        case 'Idea':
                          {
                            sharedNavigationService.navigate({
                              page: 'IdeaTemplate',
                              props: { idea: item },
                            });
                          }
                          break;
                        case 'Checklist':
                          {
                            sharedNavigationService.navigate({
                              page: 'ChecklistTemplate',
                              props: { checklist: item },
                            });
                          }
                          break;
                      }
                    }}
                  >
                    <HiveText
                      style={{ textAlign: 'center' }}
                      variant={'medium'}
                    >
                      {item.title}
                    </HiveText>
                  </TouchableOpacity>
                );
              }}
            />
          );
        }}
      ></SectionList>
    );

  return (
    <View style={styles.container}>
      {hiveData.length ? (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <View
            style={{
              // paddingTop: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <HiveText variant={'medium'} style={{ fontSize: 20 }}>
              {`What's on your mind?`}
            </HiveText>
            <Image
              source={require('../../assets/home-bee.png')}
              style={{ height: 187 * 0.3, width: 276 * 0.3, marginRight: 16 }}
              resizeMode={'contain'}
            />
          </View>
          <View style={{ paddingVertical: 16 }}>
            <SearchBar
              placeholder={'Search the Hive...'}
              value={searchText}
              onChangeText={(text: string) => setSearchText(text)}
              onDismiss={() => setSearchText('')}
            />
          </View>
          {resultsView}
        </View>
      ) : (
        zeroDataView()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 16 + topSpace(),
  },
  tabIcon: {
    height: 44,
    width: 44,
  },
  tabContainer: {
    height: 44,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  noResultsLabel: {
    marginLeft: 8,
    fontSize: 18,
  },
  headerContainer: {
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
