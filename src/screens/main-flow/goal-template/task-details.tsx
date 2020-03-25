import React, { useRef } from 'react';
import {
  View,
  // Platform,
  StyleSheet,
  Image,
  TextInput,
  // KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {
  ReduxState,
  Goal,
  GoalTaskDetailsProps,
  DispatchAction,
  ActionSheetOwnProps,
  Goals,
} from '../../../models';
import NavButton from '../../../componets/nav-button';
import sharedNavigationService from '../../../services/navigation-service';
import colors from '../../../utils/colors';
import { useSelector, useDispatch } from 'react-redux';
import * as _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import // deleteIdea,
// updateIdea,
// createIdea,
'../../../services/firebase-service';
// import { topSpace } from '../../../utils/layout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import HiveText from '../../../componets/hive-text';
import { FlatList } from 'react-native-gesture-handler';

export default (props: GoalTaskDetailsProps) => {
  const { breadcrumbs } = props.route.params;
  // const existingGoal = task;

  const constructKeysFromBreadcrumbs = () => {
    let setKeys = [];
    for (const i in breadcrumbs) {
      let index = parseInt(i);
      const breadcrumb = breadcrumbs[index];
      setKeys.push('tasks');
      setKeys.push(breadcrumb.taskIndex);
    }
    return setKeys as string[];
  };

  const tempGoal = useSelector<ReduxState, Goal>(state => state.tempGoal);
  const breadcrumbKeys = constructKeysFromBreadcrumbs();
  let tempTask = _.get(tempGoal, breadcrumbKeys) as Goal;

  const goalTitle = tempTask?.title || '';
  const goalDescription = tempTask?.description || '';
  const goalTasks = tempTask?.tasks || [];
  const goalCompleted = tempTask?.completed || false;

  const userId = useSelector<ReduxState, string>(state => state.userId);
  const dispatch = useDispatch<DispatchAction>();
  const titleInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  const breadcrumbList = useRef<FlatList<string>>(null);

  const constructAndSetGoal = (newTempGoal: Goal, key: string, value: any) => {
    _.set(newTempGoal, [...breadcrumbKeys, key], value);
  };

  const setTitle = (text: string) => {
    let newTempGoal = { ...tempGoal };
    constructAndSetGoal(newTempGoal, 'title', text);
    dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTempGoal });
  };
  const setDescription = (text: string) => {
    let newTempGoal = { ...tempGoal };
    constructAndSetGoal(newTempGoal, 'description', text);
    dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTempGoal });
  };
  const setTask = (task: Goal) => {
    let newTempGoal = { ...tempGoal };
    const tasks: Goals = [...(tempTask.tasks || []), task];
    constructAndSetGoal(newTempGoal, 'tasks', tasks);
    dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTempGoal });
    // setComplete(false);
  };
  const setComplete = (completed: boolean) => {
    let newTempGoal = { ...tempGoal };
    // Set top level
    constructAndSetGoal(newTempGoal, 'completed', completed);
    const tasks: Goals = _.get(newTempGoal, [...breadcrumbKeys, 'tasks']);
    // Set nested levels
    toggleCompleteAllNestedTasks(tasks, completed);
    dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTempGoal });
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
            title: tempTask.title,
            description: tempTask.description,
          };
          if (_.isEqual(finalTitleAndDescription, initialTitleAndDescription)) {
            // sharedNavigationService.navigate({
            //   page: 'HomeReset',
            // });
            sharedNavigationService.goBack();
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
        title={'Back'}
        position={'left'}
      />
    ),
    headerStyle: { shadowColor: colors.lightGray },
  });

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

  const getCompeleteStatusFromTasks = (tasks: Goals) => {
    for (const index in tasks) {
      const task = tasks[index];
      if (!task.completed) {
        // At least one nested task isn't complete
        if (!task.tasks?.length) {
          // No more tasks to check
          return false;
        } else {
          return getCompeleteStatusFromTasks(task.tasks);
        }
      } else {
        if (parseInt(index) !== tasks.length - 1) {
          continue;
        }
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

  const triggerCompleteTask = () => {
    if (!!goalTasks.length) {
      Alert.alert(
        'Complete Task?',
        'This will complete all subtasks you may have.',
        [
          {
            text: 'No',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => setComplete(true),
          },
        ],
      );
    } else {
      setComplete(true);
    }
  };

  const triggerResetTask = () => {
    Alert.alert(
      'Reset this task?',
      'This will reset all subtasks you may have.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Reset',
          onPress: () => {
            const newTempGoal = { ...tempGoal };
            const task = _.get(newTempGoal, breadcrumbKeys) as Goal;
            task.completed = false;
            toggleCompleteAllNestedTasks(task.tasks || [], false);
            dispatch({
              type: 'UPDATE_TEMP_GOAL',
              goal: newTempGoal,
            });
          },
        },
      ],
    );
  };

  const triggerDeleteTask = () => {
    Alert.alert(
      'Delete this task?',
      'This will delete any subtasks you may have.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Delete',
          onPress: () => {
            const newTempGoal = { ...tempGoal };
            const currentTaskIndex =
              breadcrumbs[breadcrumbs.length - 1].taskIndex;
            const parentPath = breadcrumbKeys.slice(
              0,
              breadcrumbKeys.length - 1,
            ); // Slice doesn't include second index
            const parentElementTasks = _.get(newTempGoal, parentPath);
            _.pullAt(parentElementTasks, currentTaskIndex);
            dispatch({ type: 'UPDATE_TEMP_GOAL', goal: newTempGoal });
            sharedNavigationService.goBack();
          },
        },
      ],
    );
  };

  const progress = getGoalProgress(tempTask);
  const isCompleted = getCompleteStatusFromGoal();

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
              onPress={triggerCompleteTask}
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
          onPress={createSubtask}
          style={styles.emptyTaskButton}
        >
          <Image
            style={styles.emptyTaskImage}
            resizeMode={'contain'}
            source={require('../../../assets/bee-tasks.png')}
          />
          <HiveText style={styles.emptyTaskLabel} variant={'medium'}>
            {'Break into smaller subtasks.'}
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
              // task: item,
              breadcrumbs: [
                ...breadcrumbs,
                { title: newBreadcrumbTitle, taskIndex: index },
              ],
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

  const createSubtask = () => {
    titleInputRef.current.blur();
    descriptionInputRef.current.blur();
    const lastestGoalTitle = _.trim(
      (titleInputRef.current as any)._lastNativeText || goalTitle,
    );
    if (lastestGoalTitle) {
      sharedNavigationService.push({
        page: 'GoalTaskCreation',
        props: {
          onCreateTask: ({ title, description }) => {
            // Append task
            const newTask: Goal = {
              id: `${Math.random() * 9999}`,
              title,
              description,
              timestamp: '123412',
              completed: false,
              type: 'Goal',
            };
            setTask(newTask);
          },
        },
        // props: {
        //   task: null,
        //   breadcrumbs: [`${goalTitle.slice(0, 5)}...`],
        // },
      });
    } else {
      Alert.alert('You must give your task a title before creating a subtask!');
    }
  };

  const renderTaskSection = () => {
    return (
      <View style={styles.taskSection}>
        <View style={styles.taskHeaderContainer}>
          <HiveText variant={'bold'} style={styles.taskHeaderLabel}>
            {`Subtasks `}
            <HiveText variant={'light'} style={styles.taskHeaderOptionalLabel}>
              {'(Optional)'}
            </HiveText>
          </HiveText>
          <TouchableOpacity
            onPress={createSubtask}
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

  const renderBreadcrumbs = () => {
    const currentTitle =
      goalTitle.length > 8 ? `${goalTitle.slice(0, 8)}...` : goalTitle;
    return (
      <FlatList
        ref={breadcrumbList}
        keyboardShouldPersistTaps={'handled'}
        onContentSizeChange={e => {
          (breadcrumbList.current as any).scrollToEnd({ animated: false });
        }}
        data={[...breadcrumbs.map(crumb => crumb.title), currentTitle]}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => (
          <Image
            source={require('../../../assets/back-icon.png')}
            resizeMode={'contain'}
            style={{
              height: 24,
              width: 24,
              marginHorizontal: 4,
              tintColor: colors.inactiveGray,
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => {
          const isLastItem = index === breadcrumbs.length;
          return (
            <TouchableOpacity
              disabled={isLastItem}
              style={{ paddingRight: isLastItem ? 16 : 0 }}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              onPress={() => props.navigation.pop(breadcrumbs.length - index)}
            >
              <HiveText
                variant={'medium'}
                style={{
                  color: isLastItem ? colors.inactiveGray : '#C57BFF',
                  opacity: 0.75,
                  fontSize: 18,
                }}
              >
                {item}
              </HiveText>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const subMenuOptions: ActionSheetOwnProps = {
    options: [],
  };

  if (!isCompleted) {
    subMenuOptions.options.push({
      onPress: triggerCompleteTask,
      buttonType: 'first',
      title: 'Complete Task',
    });
  }

  subMenuOptions.options.push({
    onPress: triggerResetTask,
    buttonType: 'second',
    title: 'Reset Task',
  });

  subMenuOptions.options.push({
    onPress: triggerDeleteTask,
    buttonType: 'third',
    title: 'Delete Task',
  });

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        {renderBreadcrumbs()}
        <View style={styles.goalSection}>
          <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 4 }}>
            <TextInput
              ref={titleInputRef}
              autoCorrect={false}
              selectionColor={colors.salmonRed}
              placeholderTextColor={colors.lightPurple}
              style={styles.titleInput}
              placeholder={'Task'}
              defaultValue={goalTitle}
              onEndEditing={e => {
                let text = _.trim(e.nativeEvent.text);
                if (!text) {
                  text = 'New Task';
                  titleInputRef.current.setNativeProps({ text });
                }
                setTitle(text);
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
            scrollEnabled={false}
            multiline={true}
            placeholder={'Describe this task...'}
            defaultValue={goalDescription}
            onEndEditing={e => {
              let text = _.trim(e.nativeEvent.text);
              if (!text) {
                descriptionInputRef.current.setNativeProps({ text: '' });
              }
              setDescription(text);
            }}
          />
          {renderProgressSection()}
        </View>
        <View style={styles.sectionSeparator} />
        {renderTaskSection()}
      </KeyboardAwareScrollView>
      {/* <KeyboardAvoidingView
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
      </KeyboardAvoidingView> */}
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
    flex: 1,
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 30,
    color: colors.offBlack,
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
    marginTop: 12,
    overflow: 'hidden',
    flexDirection: 'row',
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
