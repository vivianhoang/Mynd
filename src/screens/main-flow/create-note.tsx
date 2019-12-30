import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
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
        categoryName: categoryName,
        categoryId: category?.id,
        noteDescription: noteDescription,
      });
    }
  };

  props.navigation.setOptions({
    headerRight: () => (
      <NavButton
        onPress={rightNavOnPress}
        title={rightNavLabel}
        position={'right'}
      />
    ),
    headerTitle: null,
    headerLeft: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.goBack();
        }}
        title={'Back'}
        position={'left'}
      />
    ),
  });

  const deleteButton = existingNote ? (
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
      <Text>{'Delete'}</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.categoryInput}
        value={categoryName}
        onChangeText={text => setCategoryName(text)}
      ></TextInput>
      <TextInput
        style={styles.noteInput}
        value={noteDescription}
        onChangeText={text => setNoteDescription(text)}
      ></TextInput>
      {deleteButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  categoryInput: {
    height: 50,
    backgroundColor: 'red',
  },
  noteInput: {
    height: 50,
    backgroundColor: 'blue',
  },
  deleteButton: {
    height: 50,
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
});
