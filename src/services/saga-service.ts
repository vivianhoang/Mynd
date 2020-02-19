import { all, take, put, call, select } from 'redux-saga/effects';
import { ReduxState, ReduxActions, Idea, Ideas } from '../models';
import { channel } from 'redux-saga';
import {
  createNote,
  // subscribeToCategories,
  subscribeToCategory,
  subscribeToHive,
  unsubscribeFromId,
  updateNote,
  deleteNote,
  deleteCategory,
  updateCategory,
  updateIdea,
  deleteIdea,
  createIdea,
} from './firebase-service';
import sharedNavigationService from './navigation-service';

// const categoriesChannel = channel();
// function* getCategories() {
//   const userId: string = yield select((state: ReduxState) => state.userId);
//   subscribeToCategories(categoriesById => {
//     categoriesChannel.put({
//       type: 'SET_CATEGORIES_BY_ID',
//       categoriesById,
//     } as ReduxActions);
//   }, userId);
// }

// function* takeCategoriesChannel() {
//   while (true) {
//     const action = yield take(categoriesChannel);
//     yield put(action);
//   }
// }

function* takeCreateNote() {
  while (true) {
    const action = yield take('CREATE_NOTE');
    const {
      categoryId,
      noteDescription,
      noteTimestamp,
      categoryTitle,
    } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() =>
      createNote(
        categoryId,
        categoryTitle,
        noteDescription,
        noteTimestamp,
        userId,
      ),
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

function* takeUpdateCategory() {
  while (true) {
    const action = yield take('UPDATE_CATEGORY');
    const { category } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => updateCategory(category, userId));
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

const hiveChannel = channel();
function* getHiveInfo() {
  const userId: string = yield select((state: ReduxState) => state.userId);
  subscribeToHive(hiveData => {
    hiveChannel.put({
      type: 'SET_HIVE_DATA',
      hiveData,
    } as ReduxActions);
  }, userId);
}

function* takeIdeasChannel() {
  while (true) {
    const action = yield take(hiveChannel);
    yield put(action);
  }
}

function* takeUnsubscribeIdea() {
  while (true) {
    const action = yield take('UNSUBSCRIBE_FROM_IDEA');
    const { ideas } = action;
    const typedIdeas = ideas as Ideas;

    typedIdeas.forEach(idea => {
      unsubscribeFromId(idea.id);
    });
  }
}

function* takeCreateIdea() {
  while (true) {
    const action = yield take('CREATE_IDEA');
    const { ideaId, title, description } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => createIdea(ideaId, title, description, userId));
    sharedNavigationService.goBack();
  }
}

function* takeUpdateIdea() {
  while (true) {
    const action = yield take('UPDATE_IDEA');
    const { ideaId, title, description } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => updateIdea(ideaId, title, description, userId));
    sharedNavigationService.goBack();
  }
}

function* takeDeleteIdea() {
  while (true) {
    const action = yield take('DELETE_IDEA');
    const { ideaId } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => deleteIdea(ideaId, userId));
    sharedNavigationService.goBack();
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
    // takeCategoriesChannel(),
    takeIdeasChannel(),
    // getCategories(),
    takeCreateNote(),
    takeUpdateNote(),
    takeDeleteNote(),
    takeUpdateCategory(),
    takeDeleteCategory(),
    takeSubscribeToCategory(),
    takeCategoryChannel(),
    takeUnsubscribeCategory(),
    getHiveInfo(),
    takeUnsubscribeIdea(),
    takeCreateIdea(),
    takeUpdateIdea(),
    takeDeleteIdea(),
  ]);
}
