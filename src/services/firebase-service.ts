import FirebaseFirestore from '@react-native-firebase/firestore';
import {
  Idea,
  TemplateData,
  TemplateType,
  HiveData,
  JsonHiveData,
  Checklist,
  ChecklistItem,
} from '../models';
import * as _ from 'lodash';

let subscriptionById = {};

export const subscribeToHive = (
  onTrigger: (hiveData: any) => void,
  userId: string,
) => {
  const path = `users/${userId}/hive`;
  const subscription = FirebaseFirestore()
    .collection(path)
    .onSnapshot(
      snapshot => {
        console.log(snapshot);
        if (!snapshot.empty) {
          const jsonHiveData = _.reduce(
            snapshot.docs,
            (finalHiveData, doc) => {
              const templateData = doc.data() as TemplateData;
              const existingData = finalHiveData[templateData.type] || [];
              finalHiveData[templateData.type] = _.orderBy(
                [...existingData, templateData],
                data => {
                  return data.timestamp;
                },
                ['asc'],
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
          ).sort((a, b) => {
            return a.title > b.title ? 1 : -1;
          });
          // console.log(hiveData);
          onTrigger(hiveData);
        } else {
          console.log('EMPTY');
          onTrigger([]);
        }
      },
      error => {
        console.log('ERROR!', error);
      },
    );
  // Store subscription for unsubscribing on logout
  subscriptionById['hive'] = subscription;
};

export const createIdea = async (params: {
  title: string;
  description: string;
  userId: string;
}) => {
  const { title, description, userId } = params;
  const hiveRef = FirebaseFirestore().collection(`users/${userId}/hive`);
  const ideaId = hiveRef.doc().id;
  const newIdea: Idea = {
    id: ideaId,
    title: title,
    description: description,
    timestamp: new Date().getTime().toString(),
    type: 'Idea',
  };
  try {
    await hiveRef.doc(ideaId).set(newIdea);
  } catch (error) {
    console.log('Failed to create idea!', error.message);
  }
};

export const updateIdea = async (params: {
  title: string;
  description: string;
  userId: string;
  id: string;
  timestamp: string;
}) => {
  const { title, description, userId, id, timestamp } = params;
  const ideaRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  const updatedIdea: Idea = {
    id,
    title: title,
    description: description,
    timestamp,
    type: 'Idea',
  };

  try {
    await ideaRef.update(updatedIdea);
  } catch (error) {
    console.log('Failed to update idea!', error.message);
  }
};

export const deleteIdea = async (params: { id: string; userId: string }) => {
  const { id, userId } = params;
  const ideaRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  try {
    await ideaRef.delete();
  } catch (error) {
    console.log('Failed to delete idea!', error.message);
  }
};

export const createChecklist = async (params: {
  title: string;
  items: ChecklistItem[];
  userId: string;
}) => {
  const { title, items, userId } = params;
  const hiveRef = FirebaseFirestore().collection(`users/${userId}/hive`);
  const checklistId = hiveRef.doc().id;
  const newChecklist: Checklist = {
    id: checklistId,
    title: title,
    items,
    timestamp: new Date().getTime().toString(),
    type: 'Checklist',
  };
  try {
    await hiveRef.doc(checklistId).set(newChecklist);
  } catch (error) {
    console.log('Failed to create checklist!', error.message);
  }
};

export const updateChecklist = async (params: {
  title: string;
  items: ChecklistItem[];
  userId: string;
  id: string;
  timestamp: string;
}) => {
  const { title, items, userId, id, timestamp } = params;
  const checklistRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  const updatedChecklist: Checklist = {
    id,
    title: title,
    items,
    timestamp,
    type: 'Checklist',
  };

  try {
    await checklistRef.update(updatedChecklist);
  } catch (error) {
    console.log('Failed to update checklist!', error.message);
  }
};

export const deleteChecklist = async (params: {
  id: string;
  userId: string;
}) => {
  const { id, userId } = params;
  const checklistRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  try {
    await checklistRef.delete();
  } catch (error) {
    console.log('Failed to delete checklist!', error.message);
  }
};

export const unsubscribeFromId = (id: string) => {
  const unsubscribe = subscriptionById[id];
  if (unsubscribe) {
    unsubscribe();
    delete subscriptionById[id];
  }
};

export const unsubscribeFromAll = () => {
  for (const id in subscriptionById) {
    unsubscribeFromId(id);
  }
};
