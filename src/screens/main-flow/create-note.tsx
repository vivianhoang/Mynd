import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  ReduxState,
  CategoriesById,
  DispatchAction,
  CreateNoteProps,
} from '../../models';
import * as _ from 'lodash';
import NavButton from '../../componets/nav-button';
import sharedNavigationService from '../../services/navigation-service';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../utils/colors';
import HiveTextInput from '../../componets/hive-text-input';
import HiveText from '../../componets/hive-text';

export default (props: CreateNoteProps) => {
  const existingNote = props.route.params?.note;
  const existingCategory = props.route.params?.category;

  const [categoryName, setCategoryName] = useState(
    existingCategory?.title || '',
  );
  const [noteDescription, setNoteDescription] = useState(
    existingNote?.description || '',
  );

  const existingCategoriesById = useSelector<ReduxState, CategoriesById>(
    state => state.categoriesById,
  );

  const dispatch = useDispatch<DispatchAction>();
  const rightNavLabel = existingNote ? 'Save' : 'Create';

  const rightNavOnPress = () => {
    if (existingNote) {
      dispatch({
        type: 'UPDATE_NOTE',
        note: { id: existingNote.id, description: noteDescription },
        categoryId: existingCategory.id,
      });
    } else {
      const category = _.find(existingCategoriesById, category => {
        return category.title === categoryName;
      });

      dispatch({
        type: 'CREATE_NOTE',
        categoryTitle: categoryName,
        categoryId: category?.id,
        noteDescription: noteDescription,
      });
    }
  };

  const headerTitle = existingCategory ? (
    <View style={{ alignItems: 'center' }}>
      <HiveText style={{ fontSize: 12 }}>
        {existingCategory?.title?.toUpperCase()}
      </HiveText>
      <HiveText style={{ fontSize: 16, fontWeight: '700' }}>{'Note'}</HiveText>
    </View>
  ) : null;

  props.navigation.setOptions({
    headerRight: () => (
      <NavButton
        onPress={rightNavOnPress}
        title={rightNavLabel}
        position={'right'}
        color={colors.white}
        isDisabled={categoryName.length == 0}
      />
    ),
    headerTitle: () => headerTitle,
    headerStyle: {
      backgroundColor: colors.honeyOrange,
      shadowColor: 'transparent',
    },
    headerLeft: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.goBack();
        }}
        icon={'arrow-left'}
        position={'left'}
        color={colors.white}
      />
    ),
  });

  const deleteButton = existingNote ? (
    <KeyboardAvoidingView
      keyboardVerticalOffset={50 + 16}
      behavior={'position'}
    >
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          dispatch({
            type: 'DELETE_NOTE',
            categoryId: existingCategory.id,
            noteId: existingNote.id,
          });
        }}
      >
        <Icon name={'trash-2'} size={26} color={'red'} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  ) : null;

  return (
    <View style={styles.container}>
      {!existingCategory ? (
        <View style={styles.categoryInputContainer}>
          <HiveTextInput
            style={styles.categoryInput}
            value={categoryName}
            onChangeText={text => setCategoryName(text)}
            placeholder={'Set category...'}
          ></HiveTextInput>
        </View>
      ) : null}
      <HiveTextInput
        style={styles.noteInput}
        value={noteDescription}
        onChangeText={text => setNoteDescription(text)}
        textAlignVertical={'top'}
        maxLength={300}
        placeholder={'Enter note...'}
        multiline={true}
      ></HiveTextInput>
      {deleteButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  categoryInputContainer: {
    padding: 16,
    backgroundColor: colors.honeyOrange,
  },
  categoryInput: {
    // height: 50,
  },
  noteInput: {
    flex: 1,
    borderRadius: 0,
    backgroundColor: null,
    paddingTop: 16,
    // paddingBottom: 50 + 32,
  },
  deleteButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.white,
    shadowColor: colors.darkGray,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
  },
});
