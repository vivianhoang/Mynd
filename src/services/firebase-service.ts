import FirebaseFirestore from '@react-native-firebase/firestore';
import {
  Idea,
  TemplateData,
  TemplateType,
  HiveData,
  JsonHiveData,
  Checklist,
  ChecklistItem,
  Goal,
  Goals,
  Habit,
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

export const createHabit = async (params: {
  title: string;
  color: string;
  count: number;
  userId: string;
}) => {
  const { title, color, count, userId } = params;
  const hiveRef = FirebaseFirestore().collection(`users/${userId}/hive`);
  const habitId = hiveRef.doc().id;

  const newHabit: Habit = {
    id: habitId,
    title: title,
    color: color,
    count: count,
    timestamp: new Date().getTime().toString(),
    type: 'Habit',
  };

  try {
    await hiveRef.doc(habitId).set(newHabit);
  } catch (error) {
    console.log('Failed to create habit!', error.message);
  }
};

export const updateHabit = async (params: {
  id: string;
  title: string;
  color: string;
  count: number;
  timestamp: string;
  userId: string;
}) => {
  const { id, title, color, count, timestamp, userId } = params;
  const habitRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  const updatedHabit: Habit = {
    id,
    title,
    color,
    count,
    timestamp,
    type: 'Habit',
  };

  try {
    await habitRef.update(updatedHabit);
  } catch (error) {
    console.log('Failed to update habit!', error.message);
  }
};

export const deleteHabit = async (params: { id: string; userId: string }) => {
  const { id, userId } = params;
  const habitRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  try {
    habitRef.delete();
  } catch (error) {
    console.log('Failed to delete habit!', error.message);
  }
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

export const createGoal = async (params: {
  title: string;
  description: string;
  tasks: Goals;
  completed: boolean;
  userId: string;
}) => {
  const { title, description, tasks, completed, userId } = params;
  const hiveRef = FirebaseFirestore().collection(`users/${userId}/hive`);
  const goalId = hiveRef.doc().id;

  const newGoal: Goal = {
    id: goalId,
    title: title,
    description,
    tasks,
    completed,
    timestamp: new Date().getTime().toString(),
    type: 'Goal',
  };

  try {
    await hiveRef.doc(goalId).set(newGoal);
  } catch (error) {
    console.log('Failed to create goal!', error.message);
  }
};

export const updateGoal = async (params: {
  title: string;
  tasks: Goals;
  userId: string;
  id: string;
  description: string;
  timestamp: string;
  completed: boolean;
}) => {
  const {
    title,
    tasks,
    description,
    userId,
    id,
    timestamp,
    completed,
  } = params;
  const goalRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  const updatedGoal: Goal = {
    id,
    title,
    tasks,
    timestamp,
    completed,
    description,
    type: 'Goal',
  };

  try {
    await goalRef.update(updatedGoal);
  } catch (error) {
    console.log('Failed to update goal!', error.message);
  }
};

export const deleteGoal = async (params: { id: string; userId: string }) => {
  const { id, userId } = params;
  const goalRef = FirebaseFirestore().doc(`users/${userId}/hive/${id}`);

  try {
    await goalRef.delete();
  } catch (error) {
    console.log('Failed to delete goal!', error.message);
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
