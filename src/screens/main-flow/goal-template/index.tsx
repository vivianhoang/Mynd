import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ReduxState,
  GoalTemplateProps,
  Goals,
  Goal,
  DispatchAction,
  ActionSheetOwnProps,
} from '../../../models';
import NavButton from '../../../componets/nav-button';
import sharedNavigationService from '../../../services/navigation-service';
import colors from '../../../utils/colors';
import { useSelector, useDispatch } from 'react-redux';
import * as _ from 'lodash';
import { TouchableOpacity } from 'react-native';
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
  const dispatch = useDispatch<DispatchAction>();
  const defaultGoal: Goal = {
    id: 'temp-goal-id',
    title: '',
    description: '',
    timestamp: 'temp-timestamp',
    completed: false,
    type: 'Goal',
  };

  useEffect(() => {
    dispatch({
      type: 'UPDATE_TEMP_GOAL',
      goal: existingGoal || defaultGoal,
    });
  }, []);

  const tempGoal = useSelector<ReduxState, Goal>(state => state.tempGoal);
  const goalTitle = tempGoal?.title || '';
  const goalDescription = tempGoal?.description || '';
  const goalTasks = tempGoal?.tasks || [];
  const goalCompleted = tempGoal?.completed || false;

  const userId = useSelector<ReduxState, string>(state => state.userId);
  const titleInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const goBackAndResetTempGoal = () => {
    sharedNavigationService.navigate({ page: 'HomeReset' });
    // Reset temp goal
    dispatch({ type: 'UPDATE_TEMP_GOAL', goal: undefined });
  };

  const updateOrCreateGoal = async () => {
    const latestGoalTitle = _.trim(
      (titleInputRef.current as any)._lastNativeText || goalTitle,
    );
    const latestDescriptionTitle = _.trim(
      (descriptionInputRef.current as any)._lastNativeText || goalDescription,
    );

    if (!latestGoalTitle) {
      Alert.alert('Goal must have a title!');
      return;
    }

    sharedNavigationService.navigate({ page: 'Loader' });
    try {
      if (existingGoal) {
        await updateGoal({
          id: existingGoal.id,
          title: latestGoalTitle,
          description: latestDescriptionTitle,
          tasks: goalTasks,
          completed: goalCompleted,
          timestamp: existingGoal.timestamp,
          userId,
        });
      } else {
        await createGoal({
          title: latestGoalTitle,
          description: latestDescriptionTitle,
          completed: goalCompleted,
          tasks: goalTasks || null,
          userId,
        });
      }

      goBackAndResetTempGoal();
    } catch (error) {
      // Same as dismissing loader
      sharedNavigationService.goBack();
      Alert.alert('Uh oh!', `Couldn't save goal. ${error.message}`);
    }
  };

  const checkForChanges = () => {
    let goalToUpdate = existingGoal || defaultGoal;
    const finalGoal = { ...tempGoal };
    const lastestGoalTitle = _.trim(
      (titleInputRef.current as any)._lastNativeText !== undefined
        ? (titleInputRef.current as any)._lastNativeText
        : goalToUpdate.title,
    );
    const latestDescriptionTitle = _.trim(
      (descriptionInputRef.current as any)._lastNativeText !== undefined
        ? (descriptionInputRef.current as any)._lastNativeText
        : goalToUpdate.description,
    );
    finalGoal.title = lastestGoalTitle;
    finalGoal.description = latestDescriptionTitle;
    return !_.isEqual(goalToUpdate, finalGoal);
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
          const hasChanges = checkForChanges();
          if (hasChanges) {
            Alert.alert(
              'It looks like you have some unsaved changes',
              'Do you wish to continue?',
              [
                {
                  text: 'No',
                },
                {
                  text: 'Yes',
                  onPress: () => goBackAndResetTempGoal(),
                },
              ],
            );
          } else {
            goBackAndResetTempGoal();
          }
        }}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerStyle: { shadowColor: colors.lightGray },
  });

  const getTasksProgress = (
    tasks: Goals,
  ) => {
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

  const toggleCompleteAllNestedTasks = (tasks: Goals, complete: boolean) => {
    for (const index in tasks) {
      const task = tasks[index];
      tasks[index].completed = complete;
      if (task.tasks?.length) {
        // Recursion
        toggleCompleteAllNestedTasks(tasks[index].tasks, complete);
      }
    }
  };

  const triggerCompleteGoal = () => {
    if (!!goalTasks.length) {
      Alert.alert(
        'Complete Goal?',
        'This will complete all tasks you may have.',
        [
          {
            text: 'No',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              // Complete all nested tasks
              const newGoal = { ...tempGoal };
              newGoal.completed = true;
              toggleCompleteAllNestedTasks(newGoal.tasks, true);
              dispatch({
                type: 'UPDATE_TEMP_GOAL',
                goal: newGoal,
              });
            },
          },
        ],
      );
    } else {
      const newTask: Goal = {
        ...tempGoal,
        completed: true,
      };
      dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTask });
    }
  };

  const triggerResetGoal = () => {
    Alert.alert('Reset this goal?', 'This will reset all tasks you may have.', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Reset',
        onPress: () => {
          // Complete all nested tasks
          const newGoal = { ...tempGoal };
          newGoal.completed = false;
          toggleCompleteAllNestedTasks(newGoal.tasks, false);
          dispatch({
            type: 'UPDATE_TEMP_GOAL',
            goal: newGoal,
          });
        },
      },
    ]);
  };

  const triggerDeleteGoal = () => {
    Alert.alert(
      'Delete this goal?',
      'This will delete any tasks you may have.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Delete',
          onPress: async () => {
            sharedNavigationService.navigate({ page: 'Loader' });
            try {
              await deleteGoal({ id: existingGoal.id, userId });
              goBackAndResetTempGoal();
            } catch (error) {
              // Same as dismissing loader
              sharedNavigationService.navigate({
                page: 'GoalTemplate',
                props: {
                  goal: existingGoal || null,
                },
              });
              Alert.alert('Uh oh!', `Couldn't delete idea. ${error.message}`);
            }
          },
        },
      ],
    );
  };

  const progress = getGoalProgress(tempGoal);
  const isCompleted = goalTasks.length
    ? progress.totalTasks === progress.totalComplete
    : goalCompleted;

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
        {`${progress.totalComplete}/`}
        <HiveText style={styles.taskItemLabel} variant={'medium'}>
          {`${progress.totalTasks}`}
        </HiveText>
      </HiveText>
    ) : (
      <HiveText style={styles.progressLabel}>
        {isCompleted ? 'Complete' : 'Incomplete'}
      </HiveText>
    );
  };

  const renderProgressSection = () => {
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
          {!isCompleted ? (
            <TouchableOpacity
              onPress={triggerCompleteGoal}
              style={[
                styles.completeGoalButton,
                {
                  backgroundColor: isCompleted ? '#E09DFF' : '#F1EBF3',
                },
              ]}
            >
              <Image
                style={[
                  styles.completeGoalButtonIcon,
                  {
                    tintColor: isCompleted ? colors.white : '#CBC0D3',
                  },
                ]}
                resizeMode={'contain'}
                source={require('../../../assets/check-icon.png')}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const renderEmptyTaskButton = () => {
    return (
      <View style={styles.emptyTaskContainer}>
        <TouchableOpacity
          onPress={createNewTask}
          style={styles.emptyTaskButton}
        >
          <Image
            style={styles.emptyTaskImage}
            resizeMode={'contain'}
            source={require('../../../assets/bee-tasks.png')}
          />
          <HiveText style={styles.emptyTaskLabel} variant={'medium'}>
            {'Break into smaller tasks.'}
          </HiveText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTaskItem = (item: Goal, index: number) => {
    const newBreadcrumbTitle =
      goalTitle.length > 8 ? `${goalTitle.slice(0, 8)}...` : goalTitle;
    const taskProgress = getGoalProgress(item);

    return (
      <TouchableOpacity
        onPress={() =>
          sharedNavigationService.push({
            page: 'GoalTaskDetails',
            props: {
              breadcrumbs: [{ title: newBreadcrumbTitle, taskIndex: index }],
            },
          })
        }
        style={styles.taskItem}
      >
        <View style={styles.progressLabelsContainer}>
          <HiveText style={styles.taskItemLabel} variant={'medium'}>
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
              <HiveText style={styles.taskItemLabel} variant={'medium'}>
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
              flex: taskProgress.totalTasks - taskProgress.totalComplete,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const createNewTask = () => {
    titleInputRef.current.blur();
    descriptionInputRef.current.blur();
    const lastestGoalTitle = _.trim(
      (titleInputRef.current as any)._lastNativeText || goalTitle,
    );
    const latestDescriptionTitle = _.trim(
      (descriptionInputRef.current as any)._lastNativeText || goalDescription,
    );
    if (lastestGoalTitle) {
      sharedNavigationService.push({
        page: 'GoalTaskCreation',
        props: {
          onCreateTask: ({ title, description }) => {
            const newGoal: Goal = {
              ...tempGoal,
              title: lastestGoalTitle,
              completed: false,
              description: latestDescriptionTitle,
              tasks: [
                ...(tempGoal.tasks || []),
                {
                  id: `${Math.random() * 100}`,
                  title,
                  description,
                  timestamp: '123412',
                  completed: false,
                  type: 'Goal',
                },
              ],
            };
            dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newGoal });
          },
        },
      });
    } else {
      Alert.alert('You must give your goal a title before creating a task!');
    }
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
          <TouchableOpacity
            onPress={createNewTask}
            style={{ height: 36, width: 36 }}
          >
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
          keyboardShouldPersistTaps={'handled'}
          renderItem={({ item, index }) => {
            return renderTaskItem(item, index);
          }}
        />
      </View>
    );
  };

  const subMenuOptions: ActionSheetOwnProps = {
    options: [],
  };

  if (!isCompleted) {
    subMenuOptions.options.push({
      onPress: triggerCompleteGoal,
      buttonType: 'first',
      title: 'Complete Goal',
    });
  }

  subMenuOptions.options.push({
    onPress: triggerResetGoal,
    buttonType: 'second',
    title: 'Reset Goal',
  });

  if (existingGoal) {
    subMenuOptions.options.push({
      onPress: triggerDeleteGoal,
      buttonType: 'third',
      title: 'Delete Goal',
    });
  }

  if (!tempGoal) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={colors.offBlack} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.goalSection}>
          <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 4 }}>
            <TextInput
              ref={titleInputRef}
              autoCorrect={false}
              selectionColor={colors.salmonRed}
              placeholderTextColor={colors.lightPurple}
              style={styles.titleInput}
              placeholder={'Goal Title'}
              defaultValue={goalTitle}
              onEndEditing={e => {
                let text = _.trim(e.nativeEvent.text);
                if (!text) {
                  titleInputRef.current.setNativeProps({ text });
                }
                const newTask: Goal = {
                  ...tempGoal,
                  title: text,
                };
                dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTask });
              }}
              onSubmitEditing={() => {
                descriptionInputRef.current.focus();
              }}
            />
            <TouchableOpacity
              style={styles.subMenuButton}
              onPress={() =>
                sharedNavigationService.navigate({
                  page: 'ActionSheet',
                  props: subMenuOptions,
                })
              }
            >
              <Image
                source={require('../../../assets/ellipsis-icon.png')}
                resizeMode={'contain'}
                style={styles.subMenuImage}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={descriptionInputRef}
            autoCorrect={false}
            selectionColor={colors.salmonRed}
            placeholderTextColor={colors.lightPurple}
            style={styles.descriptionInput}
            onEndEditing={e => {
              const text = _.trim(e.nativeEvent.text);
              const newTask: Goal = {
                ...tempGoal,
                description: text,
              };
              if (!text) {
                descriptionInputRef.current.setNativeProps({ text: '' });
              }
              dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTask });
            }}
            scrollEnabled={false}
            multiline={true}
            placeholder={'Describe this goal...'}
            defaultValue={goalDescription}
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
    flex: 1,
  },
  descriptionInput: {
    flex: 1,
    fontFamily: 'PulpDisplay-Regular',
    fontSize: 20,
    color: colors.offBlack,
    marginBottom: 24,
  },
  subMenuButton: {
    height: 36,
    width: 36,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  subMenuImage: { height: 36, width: 36, top: 2 },
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
    flexDirection: 'row',
    marginTop: 12,
    overflow: 'hidden',
  },
  taskItemProgressBar: {
    flex: 1,
    backgroundColor: '#ECC3FF',
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeGoalButtonIcon: {
    height: 26,
    width: 26,
  },
});
