import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState, Categories, DispatchAction } from '../../models';
import * as _ from 'lodash';

interface CreateNoteProps {
  navigation: StackNavigationProp<any>;
}

export default (props: CreateNoteProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [note, setNote] = useState('');

  const existingCategories = useSelector<ReduxState, Categories>(
    state => state.categories,
  );

  const dispatch = useDispatch<DispatchAction>();

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          const category = _.find(existingCategories, category => {
            return category.title === categoryName;
          });
          dispatch({
            type: 'CREATE_NOTE',
            categoryName: categoryName,
            categoryId: category?.id,
          });
        }}
      >
        <Text>{'Save'}</Text>
      </TouchableOpacity>
    ),
  });
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.categoryInput}
        value={categoryName}
        onChangeText={text => setCategoryName(text)}
      ></TextInput>
      <TextInput
        style={styles.noteInput}
        value={note}
        onChangeText={text => setNote(text)}
      ></TextInput>
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
});
