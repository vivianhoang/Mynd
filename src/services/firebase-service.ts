import FirebaseFirestore from '@react-native-firebase/firestore';
import sharedAuthService from './auth-service';
import sharedNavigationService from './navigation-service';

export const createNote = (categoryName: string, categoryId: string) => {
  const categoriesRef = FirebaseFirestore().collection(
    `users/${sharedAuthService.userId}/categories`,
  );
  const newCategoryId = categoriesRef.doc().id;
  const noteRef = FirebaseFirestore().collection(
    `users/${sharedAuthService.userId}/categories/${newCategoryId}/notes`,
  );
  const newNoteId = noteRef.doc().id;
  // try {
  //   await categoriesRef
  //     .doc(newCategoryId)
  //     .set({ count: 1, id: newCategoryId, title: categoryName });
  //   await noteRef.doc(newNoteId).set({ description: note, id: newNoteId });

  //   sharedNavigationService.goBack();
  // } catch (error) {
  //   Alert.alert('Uh oh!', error.message);
  // }
};
