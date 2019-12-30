import FirebaseFirestore from '@react-native-firebase/firestore';
import sharedNavigationService from './navigation-service';
import { Category, CategoriesById, Notes, Note } from '../models';
import * as _ from 'lodash';

let subscriptionById = {};

export const createNote = async (
  categoryId: string,
  categoryName: string,
  noteDescription: string,
  userId: string,
) => {
  const categoriesRef = FirebaseFirestore().collection(
    `users/${userId}/categories`,
  );
  const newCategoryId = categoryId || categoriesRef.doc().id;
  const noteRef = FirebaseFirestore().collection(
    `users/${userId}/categories/${newCategoryId}/notes`,
  );
  const newNoteId = noteRef.doc().id;

  const batch = FirebaseFirestore().batch();
  batch.set(categoriesRef.doc(newCategoryId), {
    id: newCategoryId,
    title: categoryName,
  });
  batch.set(noteRef.doc(newNoteId), {
    description: noteDescription,
    id: newNoteId,
  });
  try {
    await batch.commit();
  } catch (error) {
    console.log('Failed to create note!', error.message);
  }
};

export const updateNote = async (
  categoryId: string,
  note: Note,
  userId: string,
) => {
  const noteRef = FirebaseFirestore().doc(
    `users/${userId}/categories/${categoryId}/notes/${note.id}`,
  );

  try {
    await noteRef.update(note);
  } catch (error) {
    console.log('Failed to update note!', error.message);
  }
};

export const deleteNote = async (
  noteId: string,
  categoryId: string,
  userId: string,
) => {
  const noteRef = FirebaseFirestore().doc(
    `users/${userId}/categories/${categoryId}/notes/${noteId}`,
  );

  try {
    console.log(noteRef);
    await noteRef.delete();
    console.log(noteRef, 'AfterDelete');
  } catch (error) {
    console.log('Failed to update note!', error.message);
  }
};

export const subscribeToCategories = (
  onTrigger: (categoriesById: CategoriesById) => void,
  userId: string,
) => {
  const path = `users/${userId}/categories`;
  FirebaseFirestore()
    .collection(path)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        // adding type to the returned snapshot
        const catgoriesById = _.reduce(
          snapshot.docs,
          (finalCatgoriesById, snapshot) => {
            const category = snapshot.data() as Category;
            finalCatgoriesById[category.id] = category;
            return finalCatgoriesById;
          },
          {} as CategoriesById,
        );
        onTrigger(catgoriesById);
      } else {
        onTrigger({});
        console.log('No categories!');
      }
    });
};

export const subscribeToCategory = (
  onTrigger: (notes: Notes) => void,
  userId: string,
  categoryId: string,
) => {
  const path = `users/${userId}/categories/${categoryId}/notes`;
  const subscription = FirebaseFirestore()
    .collection(path)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        // adding type to the returned snapshot
        const newNotesList = snapshot.docs.map(snapshot => {
          const note = snapshot.data() as Note;
          return note;
        });
        onTrigger(newNotesList);
        console.log('ANTHING');
      } else {
        onTrigger([]);
        console.log('No notes!');
      }
    });
  subscriptionById[categoryId] = subscription;
};

export const unsubscribeFromId = (id: string) => {
  const unsubscribe = subscriptionById[id];
  if (unsubscribe) {
    unsubscribe();
    delete subscriptionById[id];
  }
};
