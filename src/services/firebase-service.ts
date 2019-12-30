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
  try {
    await categoriesRef
      .doc(newCategoryId)
      .set({ id: newCategoryId, title: categoryName });
    await noteRef
      .doc(newNoteId)
      .set({ description: noteDescription, id: newNoteId });

    sharedNavigationService.goBack();
  } catch (error) {
    console.log('Failed to create note!', error.message);
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
