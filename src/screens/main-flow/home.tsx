import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SectionList,
  ImageRequireSource,
  ActivityIndicator,
} from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import {
  ReduxState,
  HiveData,
  TemplateType,
  TemplateData,
  Goal,
  Goals,
} from '../../models';
import colors from '../../utils/colors';
import HiveText from '../../componets/hive-text';
import SearchBar from '../../componets/search-bar';
// import sharedGeoNotificationService from '../../services/geo-notification';
import { screenSize, topSpace } from '../../utils/layout';

const iconMap: { [key in TemplateType]: ImageRequireSource } = {
  Idea: require('../../assets/ideas-icon.png'),
  Checklist: require('../../assets/checklist-icon.png'),
  Goal: require('../../assets/goals-icon.png'),
  Habit: require('../../assets/habit-icon.png'),
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
        } else if (templateData.type == 'Goal') {
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
        renderItem={e => {
          const title = e.section.title as string;
          const item = e.item;
          const numColumns = title === ('Goal' || 'Habit') ? 1 : 3;
          console.log(e);
          return (
            <FlatList
              numColumns={numColumns}
              data={[...item]}
              keyExtractor={item => {
                return item.id;
              }}
              style={{ paddingHorizontal: 16, paddingVertical: 16 }}
              renderItem={({
                item,
                index,
              }: {
                item: TemplateData;
                index: number;
              }) => {
                let marginHorizontal = index % 3 == 1 ? 16 : 0;
                switch (item.type) {
                  case 'Idea':
                    return (
                      <TouchableOpacity
                        style={[styles.cardStyle, { marginHorizontal }]}
                        onPress={() =>
                          sharedNavigationService.navigate({
                            page: 'IdeaTemplate',
                            props: { idea: item },
                          })
                        }
                      >
                        <HiveText
                          style={{ textAlign: 'center' }}
                          variant={'medium'}
                        >
                          {item.title}
                        </HiveText>
                      </TouchableOpacity>
                    );
                  case 'Checklist':
                    return (
                      <TouchableOpacity
                        style={[styles.cardStyle, { marginHorizontal }]}
                        onPress={() =>
                          sharedNavigationService.navigate({
                            page: 'ChecklistTemplate',
                            props: { checklist: item },
                          })
                        }
                      >
                        <HiveText
                          style={{ textAlign: 'center' }}
                          variant={'medium'}
                        >
                          {item.title}
                        </HiveText>
                      </TouchableOpacity>
                    );
                  case 'Goal': {
                    const getTasksProgress = (tasks: Goals) => {
                      let totalTasks = 0;
                      let totalComplete = 0;
                      for (const index in tasks) {
                        const task = tasks[index];
                        if (task?.tasks?.length) {
                          // SPLIT
                          const total = getTasksProgress(task.tasks);
                          totalTasks += total.totalTasks;
                          totalComplete += total.totalComplete;
                        } else {
                          totalTasks += 1;
                          if (task?.completed) {
                            totalComplete += 1;
                          }
                        }
                      }
                      return { totalTasks, totalComplete };
                    };
                    const getGoalProgress = (goal: Goal) => {
                      let totalTasks = 0;
                      let totalComplete = 0;
                      const tasks = goal?.tasks || [];

                      if (tasks.length) {
                        return getTasksProgress(tasks);
                      } else {
                        totalTasks = 1;
                        if (goal?.completed) {
                          totalComplete = 1;
                        }
                      }

                      return { totalTasks, totalComplete };
                    };
                    const taskProgress = getGoalProgress(item);

                    return (
                      <TouchableOpacity
                        style={[styles.fullRowCardStyle]}
                        onPress={() =>
                          sharedNavigationService.navigate({
                            page: 'GoalTemplate',
                            props: { goal: item },
                          })
                        }
                      >
                        <View style={styles.progressLabelsContainer}>
                          <HiveText
                            style={styles.taskItemLabel}
                            variant={'medium'}
                          >
                            {item.title}
                          </HiveText>
                          {item.tasks?.length ? (
                            <HiveText
                              style={[
                                styles.taskItemLabel,
                                {
                                  color: colors.inactiveGray,
                                },
                              ]}
                              variant={'medium'}
                            >
                              {`${taskProgress.totalComplete}/`}
                              <HiveText
                                style={styles.taskItemLabel}
                                variant={'medium'}
                              >
                                {`${taskProgress.totalTasks}`}
                              </HiveText>
                            </HiveText>
                          ) : (
                            <HiveText style={styles.progressLabel}>
                              {item.completed ? 'Complete' : 'Incomplete'}
                            </HiveText>
                          )}
                        </View>
                        <View style={styles.taskItemProgressBarContainer}>
                          <View
                            style={[
                              styles.taskItemProgressBar,
                              {
                                flex: taskProgress.totalComplete,
                              },
                            ]}
                          />
                          <View
                            style={{
                              flex:
                                taskProgress.totalTasks -
                                taskProgress.totalComplete,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  };
                case 'Habit':
                  return (
                    <TouchableOpacity
                      style={styles.fullRowCardStyle}
                      onPress={() =>
                        sharedNavigationService.navigate({
                          page: 'HabitTemplate',
                          props: { habit: item },
                        })
                      }
                    >
                      <HiveText
                        style={{ textAlign: 'center' }}
                        variant={'medium'}
                      >
                        {item.title}
                      </HiveText>
                    </TouchableOpacity>
                  );
                }
              }}
            />
          );
        }}
      ></SectionList>
    );

  return (
    <View style={styles.container}>
      {hiveData.length ? (
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16 }}>
            <View
              style={{
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
  cardStyle: {
    height: (375 - 32) / 3,
    width: (screenSize.width - 64) / 3,
    backgroundColor: colors.white,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
    shadowColor: colors.offBlack,
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  fullRowCardStyle: {
    shadowColor: colors.offBlack,
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    padding: 16,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 12,
  },
  taskItemProgressBarContainer: {
    height: 10,
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#F1EBF3',
    marginTop: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  taskItemProgressBar: {
    flex: 1,
    backgroundColor: '#E09DFF',
  },
  progressLabel: {
    fontSize: 18,
    color: colors.inactiveGray,
  },
  taskItemLabel: {
    fontSize: 18,
  },
  progressLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
