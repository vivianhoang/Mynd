import { all, take, put, call, select } from 'redux-saga/effects';
import { ReduxState, ReduxActions } from '../models';
import { channel } from 'redux-saga';
import {
  createNote,
  subscribeToCategories,
  subscribeToCategory,
  unsubscribeFromId,
  updateNote,
  deleteNote,
  deleteCategory,
} from './firebase-service';
import sharedNavigationService from './navigation-service';

const categoriesChannel = channel();
function* getCategories() {
  const userId: string = yield select((state: ReduxState) => state.userId);
  subscribeToCategories(categoriesById => {
    categoriesChannel.put({
      type: 'SET_CATEGORIES_BY_ID',
      categoriesById,
    } as ReduxActions);
  }, userId);
}

function* takeCategoriesChannel() {
  while (true) {
    const action = yield take(categoriesChannel);
    yield put(action);
  }
}

function* takeCreateNote() {
  while (true) {
    const action = yield take('CREATE_NOTE');
    const { categoryId, noteDescription, categoryName } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() =>
      createNote(categoryId, categoryName, noteDescription, userId),
    );
    sharedNavigationService.goBack();
  }
}

function* takeUpdateNote() {
  while (true) {
    const action = yield take('UPDATE_NOTE');
    const { note, categoryId } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => updateNote(categoryId, note, userId));
    sharedNavigationService.goBack();
  }
}

const categoryChannel = channel();
function* takeSubscribeToCategory() {
  while (true) {
    const action = yield take('SUBSCRIBE_TO_CATEGORY');
    const { categoryId } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);

    subscribeToCategory(
      notes => {
        categoryChannel.put({
          type: 'SET_NOTES_BY_CATEGORY_ID',
          notes,
          categoryId,
        } as ReduxActions);
      },
      userId,
      categoryId,
    );
  }
}

function* takeCategoryChannel() {
  while (true) {
    const action = yield take(categoryChannel);
    yield put(action);
  }
}

function* takeUnsubscribeCategory() {
  while (true) {
    const action = yield take('UNSUBSCRIBE_FROM_CATEGORY');
    const { categoryId } = action;
    unsubscribeFromId(categoryId);
  }
}

function* takeDeleteNote() {
  while (true) {
    const action = yield take('DELETE_NOTE');
    const { noteId, categoryId } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => deleteNote(noteId, categoryId, userId));
    sharedNavigationService.goBack();
  }
}

function* takeDeleteCategory() {
  while (true) {
    const action = yield take('DELETE_CATEGORY');
    const { categoryId } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => deleteCategory(categoryId, userId));
    sharedNavigationService.navigate({ page: 'Home' });
  }
}

export default function* rootSaga() {
  yield all([
    takeCategoriesChannel(),
    getCategories(),
    takeCreateNote(),
    takeUpdateNote(),
    takeDeleteNote(),
    takeDeleteCategory(),
    takeSubscribeToCategory(),
    takeCategoryChannel(),
    takeUnsubscribeCategory(),
  ]);
}
