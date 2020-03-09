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
  Platform,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {
  ChecklistTemplateProps,
  ChecklistItem,
  ReduxState,
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
import { topSpace } from '../../utils/layout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import HiveText from '../../componets/hive-text';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const CheckListRow = (props: {
  item: ChecklistItem;
  onToggle: () => void;
  inputRef: RefObject<TextInput>;
  onEndEditing: (text: string) => void;
  onSubmitEditing: () => void;
  onChangeText?: (text: string) => void;
}) => {
  const { title, checked } = props.item;
  return (
    <View style={styles.rowContainer}>
      <TextInput
        ref={props.inputRef}
        placeholderTextColor={colors.lightPurple}
        placeholder={'Item'}
        defaultValue={title}
        onChangeText={props.onChangeText}
        enableNewLine={false}
        onSubmitEditing={props.onSubmitEditing}
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
  const [checklistItems, setChecklistItems] = useState(
    existingChecklist?.items || [],
  );
  const [newInputToggle, setNewInputToggle] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemChecked, setNewItemChecked] = useState(false);
  const [newItemTitle2, setNewItemTitle2] = useState('');
  const [newItemChecked2, setNewItemChecked2] = useState(false);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  let inputRefList = useRef(checklistItems.map(() => createRef<TextInput>()));
  let swipeableRefList = useRef(
    checklistItems.map(() => createRef<Swipeable>()),
  );
  const newInputRef = useRef<TextInput>(null);
  const newInputRef2 = useRef<TextInput>(null);
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

    // Check for new item
    if (_.trim(newItemTitle)) {
      const newItem: ChecklistItem = {
        title: _.trim(newItemTitle),
        checked: newItemChecked,
        timestamp: new Date().getTime().toString(),
      };
      newItems.push(newItem);
    }

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
            onPress={() => {
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
            }}
            title={'Delete'}
            position={'right'}
            color={'red'}
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
          />
          {checklistItems.map((item, index) => {
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
                      onSubmitEditing={() => {
                        const nextInputRef = inputRefList?.current[index + 1];
                        if (nextInputRef && nextInputRef.current) {
                          console.log('focusing next...');
                          nextInputRef.current && nextInputRef.current.focus();
                        } else {
                          console.log('focusing new', newInputRef);
                          newInputRef2.current && newInputRef2.current.focus();
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
                        if (!_.trim(text)) {
                          // Remove
                          newItems.splice(index, 1);
                        } else {
                          newItems[index] = { ...item, title: text };
                        }
                        setChecklistItems(newItems);
                      }}
                    />
                  </Swipeable>
                </View>
              </TapGestureHandler>
            );
          })}
          {/* New input */}
          <View>
            <View
              style={[
                !newInputToggle ? StyleSheet.absoluteFillObject : null,
                {
                  opacity: newInputToggle ? 1 : 0,
                },
              ]}
            >
              <CheckListRow
                inputRef={newInputRef}
                item={{
                  title: newItemTitle,
                  timestamp: new Date().getTime().toString(),
                  checked: newItemChecked,
                }}
                onChangeText={text => setNewItemTitle(text)}
                onSubmitEditing={() => {
                  setNewInputToggle(false);
                  newInputRef2.current && newInputRef2.current.focus();
                }}
                onToggle={() => setNewItemChecked(!newItemChecked)}
                onEndEditing={() => {
                  if (_.trim(newItemTitle)) {
                    const newItem: ChecklistItem = {
                      title: _.trim(newItemTitle),
                      checked: newItemChecked,
                      timestamp: new Date().getTime().toString(),
                    };
                    const newItems = [...checklistItems, newItem];
                    setChecklistItems(newItems);
                  }
                  setNewItemTitle('');
                  setNewItemChecked(false);
                }}
              />
            </View>
            <View
              pointerEvents={newInputToggle ? 'none' : 'auto'}
              style={[
                newInputToggle ? StyleSheet.absoluteFillObject : null,
                {
                  opacity: newInputToggle ? 0 : 1,
                },
              ]}
            >
              <CheckListRow
                inputRef={newInputRef2}
                item={{
                  title: newItemTitle2,
                  timestamp: new Date().getTime().toString(),
                  checked: newItemChecked2,
                }}
                onChangeText={text => setNewItemTitle2(text)}
                onSubmitEditing={() => {
                  setNewInputToggle(true);
                  newInputRef.current && newInputRef.current.focus();
                }}
                onToggle={() => setNewItemChecked2(!newItemChecked2)}
                onEndEditing={() => {
                  if (_.trim(newItemTitle2)) {
                    const newItem: ChecklistItem = {
                      title: _.trim(newItemTitle2),
                      checked: newItemChecked2,
                      timestamp: new Date().getTime().toString(),
                    };
                    const newItems = [...checklistItems, newItem];
                    setChecklistItems(newItems);
                  }
                  setNewItemTitle2('');
                  setNewItemChecked2(false);
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'position', android: undefined })}
        keyboardVerticalOffset={44 + topSpace()}
      >
        <TouchableOpacity
          onPress={updateOrCreateList}
          style={styles.saveButton}
        >
          <Image
            style={styles.icon}
            source={require('../../assets/check-icon.png')}
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
  icon: {
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
  delete: {
    width: 100,
    backgroundColor: 'red',
    opacity: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
