import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FirebaseFirestore from '@react-native-firebase/firestore';
import sharedAuthService from '../../services/auth-service';
import sharedNavigationService from '../../services/navigation-service';

interface CreateNoteProps {
  navigation: StackNavigationProp<any>;
}

export default (props: CreateNoteProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [note, setNote] = useState('');

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={async () => {
          const categoriesRef = FirebaseFirestore().collection(
            `users/${sharedAuthService.userId}/categories`,
          );
          const newCategoryId = categoriesRef.doc().id;
          const noteRef = FirebaseFirestore().collection(
            `users/${sharedAuthService.userId}/categories/${newCategoryId}/notes`,
          );
          const newNoteId = noteRef.doc().id;
          try {
            await categoriesRef
              .doc(newCategoryId)
              .set({ count: 1, id: newCategoryId, title: categoryName });
            await noteRef
              .doc(newNoteId)
              .set({ description: note, id: newNoteId });

            sharedNavigationService.goBack();
          } catch (error) {
            Alert.alert('Uh oh!', error.message);
          }
          // await FirebaseFirestore().collection(`users/${sharedAuthService.userId}/categories/`).doc(userId).set({});
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
