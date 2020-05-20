import React, {
  useState,
  useRef,
  createRef,
  RefObject,
  useEffect,
  useReducer,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ChecklistTemplateProps,
  ChecklistItem,
  ReduxState,
  ActionSheetOwnProps,
} from '../../models';
import NavButton from '../../componets/nav-button';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import {
  deleteChecklist,
  createChecklist,
  updateChecklist,
} from '../../services/firebase-service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import HiveText from '../../componets/hive-text';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import DoneButton from '../../componets/done-button';

const CheckListRow = (props: {
  item: ChecklistItem;
  onToggle: () => void;
  inputRef: RefObject<TextInput>;
  onEndEditing: (text: string) => void;
  onSubmitEditing: (text: string) => void;
  onChangeText?: (text: string) => void;
  isLastRow?: boolean;
}) => {
  const { title, checked } = props.item;
  return (
    <View
      style={props.isLastRow ? styles.lastRowContainer : styles.rowContainer}
    >
      <TextInput
        ref={props.inputRef}
        placeholderTextColor={colors.lightPurple}
        placeholder={'Item'}
        defaultValue={title}
        onChangeText={props.onChangeText}
        enableNewLine={false}
        onSubmitEditing={e => {
          props.onSubmitEditing(e.nativeEvent.text);
        }}
        selectionColor={colors.salmonRed}
        style={styles.rowInput}
        multiline={true}
        scrollEnabled={false}
        blurOnSubmit={false}
        onEndEditing={e => props.onEndEditing(e.nativeEvent.text)}
      />
      <TouchableOpacity style={styles.checkBox} onPress={props.onToggle}>
        <View
          style={[
            styles.activeCheckBox,
            {
              opacity: checked ? 1 : 0,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default (props: ChecklistTemplateProps) => {
  const existingChecklist = props.route.params?.checklist;
  // const dispatch = useDispatch<DispatchAction>();

  const [checklistTitle, setChecklistTitle] = useState(
    existingChecklist?.title || '',
  );
  const dummyChecklistItems: ChecklistItem[] = [
    { title: '', checked: false, timestamp: new Date().getTime().toString() },
    {
      title: '',
      checked: false,
      timestamp: (new Date().getTime() + 1).toString(),
    },
  ];
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    existingChecklist?.items.concat(dummyChecklistItems) || dummyChecklistItems,
  );
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  let inputRefList = useRef(checklistItems.map(() => createRef<TextInput>()));
  let swipeableRefList = useRef(
    checklistItems.map(() => createRef<Swipeable>()),
  );

  const newTitleInputRef = useRef<TextInput>(null);

  let savedIndex: number = undefined;

  const userId = useSelector<ReduxState, string>(state => state.userId);

  useEffect(() => {
    inputRefList.current = checklistItems.map(() => createRef<TextInput>());
    swipeableRefList.current = checklistItems.map(() => createRef<Swipeable>());
    forceUpdate();
  }, [checklistItems.length]);

  const getFinalChecklist = () => {
    let newTitle = checklistTitle;
    let newItems = [...checklistItems];

    if (newTitleInputRef.current) {
      newTitle =
        _.trim((newTitleInputRef.current as any)._lastNativeText) || 'Untitled';
    }

    for (const index in inputRefList.current) {
      const inputRef = inputRefList.current[index];
      const input = inputRef.current;
      if (input && input.isFocused()) {
        input.blur();
        const lastText = (input as any)._lastNativeText;

        if (lastText == undefined) {
          continue;
        }

        if (!_.trim(lastText)) {
          // Remove
          newItems.splice(parseInt(index), 1);
        } else {
          newItems[index] = { ...newItems[index], title: _.trim(lastText) };
        }
      }
    }

    // Remove all empty items on save
    newItems = _.filter(newItems, item => !!item.title);

    return { newTitle, newItems };
  };

  const updateOrCreateList = async () => {
    const { newTitle, newItems } = getFinalChecklist();

    sharedNavigationService.navigate({ page: 'Loader' });

    try {
      if (existingChecklist) {
        await updateChecklist({
          id: existingChecklist.id,
          title: newTitle,
          items: newItems,
          timestamp: existingChecklist.timestamp,
          userId,
        });
      } else {
        await createChecklist({
          title: newTitle,
          items: newItems,
          userId,
        });
      }
      sharedNavigationService.navigate({ page: 'HomeReset' });
    } catch (error) {
      // Same as dismissing loader
      sharedNavigationService.navigate({
        page: 'ChecklistTemplate',
        props: {
          checklist: existingChecklist
            ? {
                type: 'Checklist',
                id: existingChecklist.id,
                title: newTitle,
                items: newItems,
                timestamp: existingChecklist.timestamp,
              }
            : null,
        },
      });
      Alert.alert('Uh oh!', `Couldn't save list. ${error.message}`);
    }
  };

  const triggerDeleteChecklist = () => {
    Alert.alert(
      'Are you sure you want to delete this checklist?',
      'This action cannot be undone.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            sharedNavigationService.navigate({ page: 'Loader' });
            try {
              await deleteChecklist({
                id: existingChecklist.id,
                userId,
              });
              sharedNavigationService.navigate({
                page: 'HomeReset',
              });
            } catch (error) {
              // Same as dismissing loader
              sharedNavigationService.navigate({
                page: 'ChecklistTemplate',
                props: {
                  checklist: existingChecklist || null,
                },
              });
              Alert.alert(
                'Uh oh!',
                `Couldn't delete list. ${error.message}`,
              );
            }
          },
        },
      ],
    );
  }

  const subMenuOptions: ActionSheetOwnProps = {
    options: [{onPress: triggerDeleteChecklist, buttonType: 'third', title: 'Delete Checklist'}]
  }

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.titleIcon}
        source={require('../../assets/checklist-icon.png')}
      />
    ),
    headerLeft: () => (
      <NavButton
        onPress={() => {
          const finalTitleAndItems = getFinalChecklist();
          const initialTitleAndItems = {
            newTitle: existingChecklist ? existingChecklist.title : 'Untitled',
            newItems: existingChecklist ? existingChecklist.items : [],
          };

          if (_.isEqual(initialTitleAndItems, finalTitleAndItems)) {
            sharedNavigationService.navigate({ page: 'HomeReset' });
          } else
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
        }}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerRight: existingChecklist
      ? () => (
        <NavButton
          onPress={() => sharedNavigationService.navigate({
            page: 'ActionSheet',
            props: subMenuOptions,
          })}
          icon={'subMenu'}
          position={'right'}
        />
      )
      : null,
    headerStyle: { shadowColor: colors.lightGray },
  });

  const saveItemIndex = (currentIndex: number) => {
    if (currentIndex != undefined) {
      savedIndex = currentIndex;
    }
  };

  const closeAllItems = () => {
    if (savedIndex != undefined) {
      swipeableRefList.current[savedIndex].current.close();
      savedIndex = undefined;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            selectionColor={colors.salmonRed}
            placeholderTextColor={colors.lightPurple}
            style={styles.titleInput}
            placeholder={'Untitled'}
            value={checklistTitle}
            onChangeText={text => setChecklistTitle(text)}
            ref={newTitleInputRef}
            blurOnSubmit={true}
            onSubmitEditing={() => {
              inputRefList.current[0].current.focus();
            }}
          />
          {checklistItems.map((item, index) => {
            const maxDummyIndices = checklistItems.length - 3;
            const isNewInput = index > maxDummyIndices;
            // Adding timestamp fixed issue of focusing on later items after previous has been removed
            const key = `${item.title}-${item.timestamp}`;
            const ref = inputRefList.current[index];
            const swipeableRef = swipeableRefList.current[index];

            return (
              <TapGestureHandler
                key={key}
                onHandlerStateChange={event => {
                  switch (event.nativeEvent.state) {
                    case State.BEGAN:
                      // Close all
                      closeAllItems();
                      break;
                  }
                }}
              >
                <View>
                  <Swipeable
                    ref={swipeableRef}
                    overshootRight={false}
                    shouldCancelWhenOutside={true}
                    onSwipeableWillOpen={() => {
                      saveItemIndex(index);
                    }}
                    renderRightActions={() => (
                      <TouchableOpacity
                        style={styles.delete}
                        onPress={() => {
                          let newItems = [...checklistItems];
                          newItems.splice(index, 1);
                          setChecklistItems(newItems);
                        }}
                      >
                        <HiveText style={{ color: colors.white }}>
                          {'Delete'}
                        </HiveText>
                      </TouchableOpacity>
                    )}
                    overshootLeft={false}
                    friction={1}
                  >
                    <CheckListRow
                      inputRef={ref}
                      item={item}
                      isLastRow={checklistItems.length - 1 == index}
                      onSubmitEditing={latestText => {
                        const nextInputRef = inputRefList?.current[index + 1];
                        if (nextInputRef && nextInputRef.current) {
                          if (
                            index === checklistItems.length - 2 &&
                            !latestText
                          ) {
                            ref.current.blur();
                            return;
                          }
                          nextInputRef.current && nextInputRef.current.focus();
                        }
                      }}
                      onToggle={() => {
                        let newItems = [...checklistItems];
                        newItems[index] = { ...item, checked: !item.checked };
                        setChecklistItems(newItems);
                      }}
                      onEndEditing={text => {
                        // When clicking out
                        let newItems = [...checklistItems];
                        if (isNewInput) {
                          if (_.trim(text)) {
                            // Append second to last item as latest checklist item
                            newItems[index] = { ...item, title: text };
                            // Append new empty checklist item to always maintain two empty items
                            newItems.push({
                              title: '',
                              checked: false,
                              timestamp: new Date().getTime().toString(),
                            });
                            setChecklistItems(newItems);
                          }
                        } else {
                          if (!_.trim(text)) {
                            // Remove
                            newItems.splice(index, 1);
                          }
                          setChecklistItems(newItems);
                        }
                      }}
                    />
                  </Swipeable>
                </View>
              </TapGestureHandler>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
      <DoneButton onPress={updateOrCreateList} />
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
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.placeholderGray,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  lastRowContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    opacity: 0, // make last row invisible
    paddingHorizontal: 16,
  },
  rowInput: {
    margin: 0,
    padding: 0,
    flex: 1,
    fontSize: 20,
    fontFamily: 'PulpDisplay-Regular',
    color: colors.offBlack,
    marginTop: 8,
    marginBottom: 14,
    marginRight: 16,
  },
  checkBox: {
    height: 30,
    width: 30,
    borderRadius: 18,
    borderColor: colors.lightGray,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
  },
  activeCheckBox: {
    height: 22,
    width: 22,
    borderRadius: 12,
    backgroundColor: colors.salmonRed,
  },
  delete: {
    width: 100,
    backgroundColor: 'red',
    opacity: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
