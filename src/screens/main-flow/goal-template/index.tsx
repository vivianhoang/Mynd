import React, { useState, useRef } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { ReduxState, GoalTemplateProps, Goals, Goal } from '../../../models';
import NavButton from '../../../componets/nav-button';
import sharedNavigationService from '../../../services/navigation-service';
import colors from '../../../utils/colors';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import // deleteIdea,
// updateIdea,
// createIdea,
'../../../services/firebase-service';
import { topSpace } from '../../../utils/layout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import {
  updateGoal,
  createGoal,
  deleteGoal,
} from '../../../services/firebase-service';
import HiveText from '../../../componets/hive-text';
import { FlatList } from 'react-native-gesture-handler';

export default (props: GoalTemplateProps) => {
  const existingGoal = props.route.params?.goal;

  const [goalTitle, setGoalTitle] = useState(existingGoal?.title || '');
  const [goalDescription, setGoalDescription] = useState(
    existingGoal?.description || '',
  );
  const [goalTasks, setGoalTasks] = useState<Goals>(existingGoal?.tasks || []);
  const [goalCompleted, setGoalCompleted] = useState(
    existingGoal?.completed || false,
  );

  const userId = useSelector<ReduxState, string>(state => state.userId);
  const descriptionInputRef = useRef<TextInput>(null);

  const updateOrCreateGoal = async () => {
    sharedNavigationService.navigate({ page: 'Loader' });
    try {
      if (existingGoal) {
        await updateGoal({
          id: existingGoal.id,
          title: _.trim(goalTitle) || `Untitled`,
          description: goalDescription,
          tasks: goalTasks,
          completed: goalCompleted,
          timestamp: existingGoal.timestamp,
          userId,
        });
      } else {
        const newGoalDescription = _.trim(goalDescription) || `Description`;
        const newGoalTitle = _.trim(goalTitle) || `Untitled`;

        await createGoal({
          title: newGoalTitle,
          description: newGoalDescription,
          completed: false,
          tasks: goalTasks || [],
          userId,
        });
      }
      sharedNavigationService.navigate({ page: 'HomeReset' });
    } catch (error) {
      // Same as dismissing loader
      sharedNavigationService.navigate({
        page: 'GoalTemplate',
        props: {
          goal: existingGoal
            ? {
                type: 'Goal',
                id: existingGoal.id,
                title: _.trim(goalTitle) || `Untitled`,
                description: _.trim(goalDescription) || `Description`,
                tasks: existingGoal.tasks,
                completed: existingGoal.completed,
                timestamp: existingGoal.timestamp,
              }
            : null,
        },
      });
      Alert.alert('Uh oh!', `Couldn't save goal. ${error.message}`);
    }
  };

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.titleIcon}
        source={require('../../../assets/goals-icon.png')}
      />
    ),
    headerLeft: () => (
      <NavButton
        onPress={() => {
          const finalTitleAndDescription = {
            title: goalTitle,
            description: goalDescription,
          };
          const initialTitleAndDescription = {
            title: existingGoal ? existingGoal.title : '',
            description: existingGoal ? existingGoal.description : '',
          };
          if (_.isEqual(finalTitleAndDescription, initialTitleAndDescription)) {
            sharedNavigationService.navigate({
              page: 'HomeReset',
            });
          } else {
            Alert.alert(
              'It looks like you have some unsaved changes',
              'Do you wish to continue?',
              [
                {
                  text: 'No',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    sharedNavigationService.navigate({ page: 'HomeReset' }),
                },
              ],
            );
          }
        }}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerRight: existingGoal
      ? () => (
          <NavButton
            onPress={() => {
              Alert.alert(
                'Are you sure you want to delete this idea?',
                'This action cannot be undone.',
                [
                  { text: 'Cancel' },
                  {
                    text: 'Delete',
                    onPress: async () => {
                      sharedNavigationService.navigate({ page: 'Loader' });
                      try {
                        await deleteGoal({ id: existingGoal.id, userId });
                        sharedNavigationService.navigate({ page: 'HomeReset' });
                      } catch (error) {
                        // Same as dismissing loader
                        sharedNavigationService.navigate({
                          page: 'GoalTemplate',
                          props: {
                            goal: existingGoal || null,
                          },
                        });
                        Alert.alert(
                          'Uh oh!',
                          `Couldn't delete idea. ${error.message}`,
                        );
                      }
                    },
                  },
                ],
              );
            }}
            title={'Delete'}
            position={'right'}
            color={'red'}
          />
        )
      : null,
    headerStyle: { shadowColor: colors.lightGray },
  });

  const getTasksProgress = (
    tasks: Goal[],
    totalTasks: number,
    totalComplete: number,
  ) => {
    for (const index in tasks) {
      const task = tasks[index];
      if (task.tasks.length) {
        // SPLIT
        getTasksProgress(task.tasks, totalTasks, totalComplete);
      } else {
        totalTasks += 1;
        if (task.completed) {
          totalComplete += 1;
        }
      }
    }
  };

  const getGoalProgress = () => {
    let totalTasks = 0;
    let totalComplete = 0;

    if (goalTasks.length) {
      getTasksProgress(goalTasks, totalTasks, totalComplete);
    } else {
      totalTasks = 1;
      if (goalCompleted) {
        totalComplete = 1;
      }
    }

    return { totalTasks, totalComplete };
  };

  const getCompeleteStatusFromTasks = (tasks: Goal[]) => {
    for (const index in tasks) {
      const task = tasks[index];
      if (!task.completed) {
        // At least one nested task isn't complete
        if (!task.tasks) {
          // No more tasks to check
          return false;
        } else {
          return getCompeleteStatusFromTasks(task.tasks);
        }
      } else {
        return true;
      }
    }
  };

  const getCompleteStatusFromGoal = () => {
    if (!goalTasks.length) {
      return goalCompleted;
    }
    return getCompeleteStatusFromTasks(goalTasks);
  };

  const renderStatusLabel = () => {
    return goalTasks.length ? (
      <HiveText
        style={[
          styles.taskItemLabel,
          {
            color: colors.inactiveGray,
          },
        ]}
        variant={'medium'}
      >
        {'3/'}
        <HiveText style={styles.taskItemLabel} variant={'medium'}>
          {'8'}
        </HiveText>
      </HiveText>
    ) : (
      <HiveText style={styles.progressLabel}>
        {goalCompleted ? 'Complete' : 'Incomplete'}
      </HiveText>
    );
  };

  const renderProgressSection = () => {
    const progress = getGoalProgress();

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelsContainer}>
          <HiveText style={styles.progressLabel}>{'Progress'}</HiveText>
          {renderStatusLabel()}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barComplete,
                {
                  flex: progress.totalComplete,
                },
              ]}
            ></View>
            <View
              style={{ flex: progress.totalTasks - progress.totalComplete }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              const isGoalComplete = getCompleteStatusFromGoal();
              setGoalCompleted(true);
              // Alert.alert(String(isGoalComplete));
            }}
            style={[
              styles.completeGoalButton,
              {
                backgroundColor: goalCompleted ? '#E09DFF' : '#F1EBF3',
              },
            ]}
          >
            <Image
              style={[
                styles.completeGoalButtonIcon,
                {
                  tintColor: goalCompleted ? colors.white : '#CBC0D3',
                },
              ]}
              resizeMode={'contain'}
              source={require('../../../assets/check-icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyTaskButton = () => {
    return (
      <View style={styles.emptyTaskContainer}>
        <TouchableOpacity style={styles.emptyTaskButton}>
          <Image
            style={styles.emptyTaskImage}
            resizeMode={'contain'}
            source={require('../../../assets/bee-hive.png')}
          />
          <HiveText style={styles.emptyTaskLabel} variant={'medium'}>
            {'Break into smaller tasks.'}
          </HiveText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTaskItem = (item: Goal) => {
    return (
      <TouchableOpacity style={styles.taskItem}>
        <View style={styles.progressLabelsContainer}>
          <HiveText style={styles.taskItemLabel} variant={'medium'}>
            {'Task Description'}
          </HiveText>
          <HiveText
            style={[
              styles.taskItemLabel,
              {
                color: colors.inactiveGray,
              },
            ]}
            variant={'medium'}
          >
            {'3/'}
            <HiveText style={styles.taskItemLabel} variant={'medium'}>
              {'8'}
            </HiveText>
          </HiveText>
        </View>
        <View style={styles.taskItemProgressBarContainer}>
          <View style={styles.taskItemProgressBar} />
        </View>
        {/* <View style={styles.progressContainer}>
          <View style={styles.progressLabelsContainer}>
            <HiveText>{'Progress'}</HiveText>
          </View>
          <View style={styles.barBackground}>
            <View style={styles.barForeground}></View>
          </View>
        </View> */}
      </TouchableOpacity>
    );
  };

  const renderTaskSection = () => {
    return (
      <View style={styles.taskSection}>
        <View style={styles.taskHeaderContainer}>
          <HiveText variant={'bold'} style={styles.taskHeaderLabel}>
            {`Tasks `}
            <HiveText variant={'light'} style={styles.taskHeaderOptionalLabel}>
              {'(Optional)'}
            </HiveText>
          </HiveText>
          <TouchableOpacity style={{ height: 36, width: 36 }}>
            <Image
              style={{
                flex: 1,
                height: null,
                width: null,
                tintColor: '#C57BFF',
              }}
              resizeMode={'contain'}
              source={require('../../../assets/add-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={goalTasks}
          keyExtractor={item => `${item.id}`}
          ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmptyTaskButton}
          renderItem={({ item }) => {
            return renderTaskItem(item);
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.goalSection}>
          <TextInput
            selectionColor={colors.salmonRed}
            placeholderTextColor={colors.lightPurple}
            style={styles.titleInput}
            placeholder={'Goal'}
            value={goalTitle}
            onChangeText={text => setGoalTitle(text)}
            onSubmitEditing={() => {
              descriptionInputRef.current.focus();
            }}
          />
          <TextInput
            ref={descriptionInputRef}
            selectionColor={colors.salmonRed}
            placeholderTextColor={colors.lightPurple}
            style={styles.descriptionInput}
            scrollEnabled={false}
            multiline={true}
            placeholder={'Describe this goal...'}
            value={goalDescription}
            onChangeText={text => setGoalDescription(text)}
          />
          {renderProgressSection()}
        </View>
        <View style={styles.sectionSeparator} />
        {renderTaskSection()}
      </KeyboardAwareScrollView>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'position', android: undefined })}
        keyboardVerticalOffset={44 + topSpace()}
      >
        <TouchableOpacity
          onPress={updateOrCreateGoal}
          style={styles.saveButton}
        >
          <Image
            style={styles.doneIcon}
            source={require('../../../assets/check-icon.png')}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 16,
  },
  titleIcon: {
    height: 44,
    width: 44,
  },
  titleInput: {
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 30,
    color: colors.offBlack,
    marginTop: 8,
    marginBottom: 4,
  },
  descriptionInput: {
    flex: 1,
    fontFamily: 'PulpDisplay-Regular',
    fontSize: 20,
    color: colors.offBlack,
    marginBottom: 24,
  },
  doneIcon: {
    height: 44,
    width: 44,
    tintColor: colors.white,
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.honeyOrange,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.offBlack,
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  progressContainer: {
    marginBottom: 28,
  },
  progressLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barBackground: {
    borderRadius: 8,
    backgroundColor: '#F1EBF3',
    overflow: 'hidden',
    height: 32,
    flex: 1,
    flexDirection: 'row',
  },
  barComplete: {
    backgroundColor: '#E09DFF',
  },
  sectionSeparator: {
    height: 16,
    backgroundColor: '#f3f3f3',
  },
  goalSection: {
    paddingHorizontal: 16,
  },
  taskSection: {
    paddingVertical: 24,
  },
  taskHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  taskHeaderLabel: {
    fontSize: 26,
  },
  taskHeaderOptionalLabel: {
    color: colors.inactiveGray,
    fontSize: 26,
  },
  emptyTaskContainer: {
    shadowColor: colors.offBlack,
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  emptyTaskButton: {
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  emptyTaskImage: {
    height: 120,
    width: 120,
  },
  emptyTaskLabel: {
    fontSize: 18,
  },
  taskItem: {
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
  },
  taskItemProgressBarContainer: {
    height: 10,
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#F1EBF3',
    marginTop: 12,
    overflow: 'hidden',
  },
  taskItemProgressBar: {
    flex: 1,
    marginRight: 100,
    backgroundColor: colors.inactiveGray,
  },
  progressLabel: {
    fontSize: 18,
    color: colors.inactiveGray,
  },
  taskItemLabel: {
    fontSize: 18,
  },
  taskSeparator: {
    height: 16,
  },
  completeGoalButton: {
    width: 32,
    marginLeft: 8,
    // backgroundColor: '#F1EBF3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeGoalButtonIcon: {
    // tintColor: '#CBC0D3',
    height: 26,
    width: 26,
  },
});
