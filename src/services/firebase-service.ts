import FirebaseFirestore from '@react-native-firebase/firestore';
import {
  Category,
  CategoriesById,
  Notes,
  Note,
  Idea,
  TemplateData,
  TemplateType,
  Ideas,
  Todos,
  HiveData,
  JsonHiveData,
} from '../models';
import * as _ from 'lodash';

let subscriptionById = {};

export const createNote = async (
  categoryId: string,
  categoryName: string,
  noteDescription: string,
  noteTimestamp: string,
  userId: string,
) => {
  const categoriesRef = FirebaseFirestore().collection(
    `users/${userId}/categories`,
  );
  const newCategoryId = categoryId || categoriesRef.doc().id;

  const batch = FirebaseFirestore().batch();
  batch.set(categoriesRef.doc(newCategoryId), {
    id: newCategoryId,
    title: categoryName,
  });

  if (noteDescription.length) {
    const noteRef = FirebaseFirestore().collection(
      `users/${userId}/categories/${newCategoryId}/notes`,
    );
    const newNoteId = noteRef.doc().id;
    batch.set(noteRef.doc(newNoteId), {
      description: noteDescription,
      id: newNoteId,
      timestamp: noteTimestamp,
    });
  }

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

export const updateCategory = async (category: Category, userId: string) => {
  const categoryRef = FirebaseFirestore().doc(
    `users/${userId}/categories/${category?.id}`,
  );

  try {
    await categoryRef.update(category);
  } catch (error) {
    console.log('Failed to update category name!', error.message);
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
    await noteRef.delete();
  } catch (error) {
    console.log('Failed to update note!', error.message);
  }
};

export const deleteCategory = async (categoryId: string, userId: string) => {
  const categoryRef = FirebaseFirestore().doc(
    `users/${userId}/categories/${categoryId}`,
  );

  try {
    await categoryRef.delete();
  } catch (error) {
    console.log('Failed to delete category!', error.message);
  }
};

// export const subscribeToCategories = (
//   onTrigger: (categoriesById: CategoriesById) => void,
//   userId: string,
// ) => {
//   const path = `users/${userId}/categories`;
//   FirebaseFirestore()
//     .collection(path)
//     .onSnapshot(snapshot => {
//       if (!snapshot.empty) {
//         // adding type to the returned snapshot
//         const catgoriesById = _.reduce(
//           snapshot.docs,
//           (finalCatgoriesById, snapshot) => {
//             const category = snapshot.data() as Category;
//             finalCatgoriesById[category.id] = category;
//             return finalCatgoriesById;
//           },
//           {} as CategoriesById,
//         );
//         onTrigger(catgoriesById);
//       } else {
//         onTrigger({});
//         console.log('No categories!');
//       }
//     });
// };

export const subscribeToHive = (
  onTrigger: (hiveData: any) => void,
  userId: string,
) => {
  const path = `users/${userId}/hive`;
  const subscription = FirebaseFirestore()
    .collection(path)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        // adding type to the returned snapshot
        // const newHiveData = snapshot.docs.map(snapshot => {
        //   const templateData = snapshot.data() as TemplateData;
        //   return templateData;
        // });
        const jsonHiveData = _.reduce(
          snapshot.docs,
          (finalHiveData, doc) => {
            const templateData = doc.data() as TemplateData;
            const existingData = finalHiveData[templateData.type] || [];
            finalHiveData[templateData.type] = _.sortBy(
              [...existingData, templateData],
              data => data.timestamp,
            );
            return finalHiveData;
          },
          {} as JsonHiveData,
        );
        const hiveData = _.reduce(
          jsonHiveData,
          (finalHiveData, data, templateType: TemplateType) => {
            finalHiveData.push({ title: templateType, data: [data] });
            return finalHiveData;
          },
          [] as HiveData,
        );
        console.log(hiveData);
        onTrigger(hiveData);
      } else {
        onTrigger([]);
      }
    });
  // Store subscription for unsubscribing on logout
  subscriptionById['hive'] = subscription;
};

export const createIdea = async (
  ideaId: string,
  title: string,
  description: string,
  userId: string,
) => {
  const hiveRef = FirebaseFirestore().collection(`users/${userId}`);
  const newIdeaId = ideaId || ideasRef.doc().id;
  const newIdea: Idea = {
    id: newIdeaId,
    title: title,
    description: description,
    timestamp: new Date().getTime().toString(),
    type: TemplateType.Idea,
  };
  try {
    ideasRef.add(newIdea);
  } catch (error) {
    console.log('Failed to create idea!', error.message);
  }
};

export const updateIdea = async (
  ideaId: string,
  title: string,
  description: string,
  userId: string,
) => {
  const ideaRef = FirebaseFirestore().doc(`users/${userId}/ideas/${ideaId}`);

  const updatedIdea: Idea = {
    id: ideaId,
    title: title,
    description: description,
    timestamp: new Date().getTime().toString(),
    type: TemplateType.Idea,
  };

  try {
    await ideaRef.update(updatedIdea);
  } catch (error) {
    console.log('Failed to update idea!', error.message);
  }
};

export const deleteIdea = async (ideaId: string, userId: string) => {
  const ideaRef = FirebaseFirestore().doc(`users/${userId}/ideas/${ideaId}`);

  try {
    await ideaRef.delete();
  } catch (error) {
    console.log('Failed to delete idea!', error.message);
  }
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
