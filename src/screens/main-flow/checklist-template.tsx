import React, {
  useState,
  useRef,
  createRef,
  RefObject,
  memo,
  useEffect,
  useReducer,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  DispatchAction,
  ChecklistTemplateProps,
  ChecklistItem,
} from '../../models';
import NavButton from '../../componets/nav-button';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';

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
  const dispatch = useDispatch<DispatchAction>();

  const [checklistTitle, setChecklistTitle] = useState(
    existingChecklist?.title || '',
  );
  const [checklistItems, setChecklistItems] = useState(
    existingChecklist?.items || [],
  );
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemChecked, setNewItemChecked] = useState(false);
  const [newItemFocused, setNewItemFocused] = useState(false);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  let inputRefList = useRef(checklistItems.map(() => createRef<TextInput>()));
  const newInputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRefList.current = checklistItems.map(() => createRef<TextInput>());
    forceUpdate();
  }, [checklistItems.length]);

  const rightNavOnPress = () => {
    let newItems = [...checklistItems];
    for (const index in inputRefList.current) {
      const inputRef = inputRefList.current[index];
      const input = inputRef.current;
      if (input && input.isFocused()) {
        input.blur();
        const lastText = (input as any)._lastNativeText;
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

    if (existingChecklist) {
      dispatch({
        type: 'UPDATE_CHECKLIST',
        id: existingChecklist.id,
        title: checklistTitle,
        items: newItems,
        timestamp: existingChecklist.timestamp,
      });
    } else {
      const newChecklistTitle = _.trim(checklistTitle) || `List`;

      dispatch({
        type: 'CREATE_CHECKLIST',
        title: newChecklistTitle,
        items: newItems,
      });
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
          sharedNavigationService.navigate({ page: 'HomeReset' });
        }}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerRight: () => (
      <NavButton
        onPress={rightNavOnPress}
        title={'Done'}
        position={'right'}
        color={colors.honeyOrange}
      />
    ),
    headerStyle: { shadowColor: colors.lightGray },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 400 }}
      keyboardShouldPersistTaps={'handled'}
    >
      <TextInput
        selectionColor={colors.salmonRed}
        placeholderTextColor={colors.lightPurple}
        style={styles.titleInput}
        placeholder={'Untitled'}
        value={checklistTitle}
        onChangeText={text => setChecklistTitle(text)}
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
      <View
        style={[
          styles.rowContainer,
          {
            opacity: newItemFocused ? 1 : 0,
          },
        ]}
      >
        <TextInput
          ref={newInputRef}
          onFocus={() => {
            setNewItemFocused(true);
          }}
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
            setNewItemFocused(false);
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
            // setNewItemFocused(false);
          }}
          blurOnSubmit={false}
          placeholderTextColor={colors.lightPurple}
          placeholder={'Item'}
          value={newItemTitle}
          onChangeText={text => setNewItemTitle(text)}
          selectionColor={colors.salmonRed}
          style={styles.rowInput}
          // onEndEditing={e => props.onEndEditing(e.nativeEvent.text)}
        />
        <TouchableOpacity
          style={styles.checkBox}
          disabled={!newItemFocused}
          onPress={() => setNewItemChecked(!newItemChecked)}
          onFocus={() => setNewItemFocused(true)}
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
            setNewItemFocused(false);
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
    alignItems: 'center',
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
    height: 50,
  },
  checkBox: {
    height: 30,
    width: 30,
    borderRadius: 18,
    borderColor: colors.lightGray,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCheckBox: {
    height: 22,
    width: 22,
    borderRadius: 12,
    backgroundColor: colors.salmonRed,
  },
});
