import { all, take, put, call, select } from 'redux-saga/effects';
import {
  ReduxState,
  ReduxActions,
  // Idea,
  // Ideas
} from '../models';
import { channel } from 'redux-saga';
import {
  createNote,
  subscribeToHive,
  // unsubscribeFromId,
  updateIdea,
  // deleteIdea,
  // createIdea,
  // createChecklist,
  // updateChecklist,
  // deleteChecklist,
} from './firebase-service';
import sharedNavigationService from './navigation-service';

function* initialize() {
  console.log('Sagas initalized...');
}

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

const hiveChannel = channel();
function* subscribeToHiveInfo() {
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

// function* takeUnsubscribeIdea() {
//   while (true) {
//     const action = yield take('UNSUBSCRIBE_FROM_IDEA');
//     const { ideas } = action;
//     const typedIdeas = ideas as Ideas;

//     typedIdeas.forEach(idea => {
//       unsubscribeFromId(idea.id);
//     });
//   }
// }

// function* takeCreateIdea() {
//   while (true) {
//     const action = yield take('CREATE_IDEA');
//     const { title, description } = action;
//     const userId: string = yield select((state: ReduxState) => state.userId);
//     yield call(() => createIdea(title, description, userId));
//     // Go back twice to dismiss modal
//     sharedNavigationService.navigate({ page: 'HomeReset' });
//   }
// }

function* takeUpdateIdea() {
  while (true) {
    const action = yield take('UPDATE_IDEA');
    const { id, title, description, timestamp } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => updateIdea({ title, description, userId, id, timestamp }));
    sharedNavigationService.goBack();
  }
}

// function* takeDeleteIdea() {
//   while (true) {
//     const action = yield take('DELETE_IDEA');
//     const { ideaId } = action;
//     const userId: string = yield select((state: ReduxState) => state.userId);
//     yield call(() => deleteIdea(ideaId, userId));
//     sharedNavigationService.goBack();
//   }
// }

// function* takeCreateChecklist() {
//   while (true) {
//     const action = yield take('CREATE_CHECKLIST');
//     const { title, items } = action;
//     const userId: string = yield select((state: ReduxState) => state.userId);
//     yield call(() => createChecklist(title, items, userId));
//     // Go back twice to dismiss modal
//     sharedNavigationService.navigate({ page: 'HomeReset' });
//   }
// }

// function* takeUpdateChecklist() {
//   while (true) {
//     const action = yield take('UPDATE_CHECKLIST');
//     const { id, title, items, timestamp } = action;
//     const userId: string = yield select((state: ReduxState) => state.userId);
//     yield call(() => updateChecklist(title, items, userId, id, timestamp));
//     sharedNavigationService.navigate({ page: 'HomeReset' });
//   }
// }

// function* takeDeleteChecklist() {
//   while (true) {
//     const action = yield take('DELETE_CHECKLIST');
//     const { id } = action;
//     const userId: string = yield select((state: ReduxState) => state.userId);
//     yield call(() => deleteChecklist(id, userId));
//     sharedNavigationService.goBack();
//   }
// }

export const rootSaga = function*() {
  yield all([
    // takeCreateIdea(),
    takeUpdateIdea(),
    // takeDeleteIdea(),
    // takeCreateChecklist(),
    // takeUpdateChecklist(),
    // takeDeleteChecklist(),
    takeIdeasChannel(),
  ]);
};

export const sagaAfterLogin = function*() {
  yield all([initialize(), subscribeToHiveInfo()]);
};
