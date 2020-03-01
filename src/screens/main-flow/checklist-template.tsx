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
  ScrollView,
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

const CheckListRow = (props: {
  item: ChecklistItem;
  onToggle: () => void;
  inputRef: RefObject<TextInput>;
  onEndEditing: (text: string) => void;
  onSubmitEditing: () => void;
}) => {
  const { title, checked } = props.item;
  return (
    <View style={styles.rowContainer}>
      <TextInput
        ref={props.inputRef}
        placeholderTextColor={colors.lightPurple}
        placeholder={'Item'}
        defaultValue={title}
        onSubmitEditing={props.onSubmitEditing}
        selectionColor={colors.salmonRed}
        style={styles.rowInput}
        // multiline={true}
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
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemChecked, setNewItemChecked] = useState(false);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  let inputRefList = useRef(checklistItems.map(() => createRef<TextInput>()));
  const newInputRef = useRef<TextInput>(null);
  const newTitleInputRef = useRef<TextInput>(null);

  const userId = useSelector<ReduxState, string>(state => state.userId);

  useEffect(() => {
    inputRefList.current = checklistItems.map(() => createRef<TextInput>());
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 450 }}
        keyboardShouldPersistTaps={'handled'}
      >
        <TextInput
          selectionColor={colors.salmonRed}
          placeholderTextColor={colors.lightPurple}
          style={styles.titleInput}
          placeholder={'Untitled'}
          value={checklistTitle}
          onChangeText={text => setChecklistTitle(text)}
          ref={newTitleInputRef}
        />
        {checklistItems.map((item, index) => {
          // Adding timestamp fixed issue of focusing on later items after previous has been removed
          const key = `${item.title}-${item.timestamp}`;
          const ref = inputRefList.current[index];

          return (
            <CheckListRow
              key={key}
              inputRef={ref}
              item={item}
              onSubmitEditing={() => {
                const nextInputRef = inputRefList?.current[index + 1];
                if (nextInputRef && nextInputRef.current) {
                  console.log('focusing next...');
                  nextInputRef.current && nextInputRef.current.focus();
                } else {
                  console.log('focusing new', newInputRef);
                  newInputRef.current && newInputRef.current.focus();
                }
              }}
              onToggle={() => {
                let newItems = [...checklistItems];
                newItems[index] = { ...item, checked: !item.checked };

                setChecklistItems(newItems);
              }}
              onEndEditing={text => {
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
          );
        })}
        {/* New input */}
        <View style={[styles.rowContainer]}>
          <TextInput
            ref={newInputRef}
            onBlur={() => {
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
            onSubmitEditing={() => {
              if (_.trim(newItemTitle)) {
                const newItem: ChecklistItem = {
                  title: _.trim(newItemTitle),
                  checked: newItemChecked,
                  timestamp: new Date().getTime().toString(),
                };
                const newItems = [...checklistItems, newItem];
                setChecklistItems(newItems);
              } else {
                newInputRef.current && newInputRef.current.blur();
              }
              setNewItemTitle('');
              setNewItemChecked(false);
            }}
            blurOnSubmit={false}
            placeholderTextColor={colors.lightPurple}
            placeholder={'New item'}
            value={newItemTitle}
            onChangeText={text => setNewItemTitle(text)}
            selectionColor={colors.salmonRed}
            style={styles.rowInput}
            // multiline={true}
          />
          <TouchableOpacity
            style={styles.checkBox}
            onPress={() => setNewItemChecked(!newItemChecked)}
            onBlur={() => {
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
          >
            <View
              style={[
                styles.activeCheckBox,
                {
                  opacity: newItemChecked ? 1 : 0,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
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
  },
  rowContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.placeholderGray,
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
});
