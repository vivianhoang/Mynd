import { all, take, put } from 'redux-saga/effects';
import FirebaseFirestore from '@react-native-firebase/firestore';
import sharedAuthService from './auth-service';
import { Category, ReduxActions } from '../models';
import { channel } from 'redux-saga';

function* initialize() {
  console.log('Initialize app');
  subscribeToCategories();
}

const categoriesChannel = channel();
function subscribeToCategories() {
  const path = `users/${sharedAuthService.userId}/categories`;
  const categoriesSnapshot = FirebaseFirestore()
    .collection(path)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        // adding type to the returned snapshot
        const newCategoryList = snapshot.docs.map(snapshot => {
          const category = snapshot.data() as Category;
          return category;
        });
        categoriesChannel.put({
          type: 'SET_CATEGORIES',
          categories: newCategoryList,
        } as ReduxActions);
      } else {
        console.log('No categories!');
      }
    });
  return categoriesSnapshot;
}

function* watchCategoriesChannel() {
  while (true) {
    const action = yield take(categoriesChannel);
    yield put(action);
  }
}

function* takeCreateNote() {
  while (true) {
    const action = yield take('CREATE_NOTE');
    console.log(action, 'Create note saga triggered');
  }
}

export default function* rootSaga() {
  yield all([initialize(), watchCategoriesChannel(), takeCreateNote()]);
}
