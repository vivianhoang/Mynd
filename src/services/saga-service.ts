import { all, take, put, call, select } from 'redux-saga/effects';
import { ReduxState, ReduxActions } from '../models';
import { channel } from 'redux-saga';
import { subscribeToHive, updateIdea } from './firebase-service';
import sharedNavigationService from './navigation-service';

function* initialize() {
  console.log('Sagas initalized...');
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

function* takeUpdateIdea() {
  while (true) {
    const action = yield take('UPDATE_IDEA');
    const { id, title, description, timestamp } = action;
    const userId: string = yield select((state: ReduxState) => state.userId);
    yield call(() => updateIdea({ title, description, userId, id, timestamp }));
    sharedNavigationService.goBack();
  }
}

export const rootSaga = function*() {
  yield all([takeUpdateIdea(), takeIdeasChannel()]);
};

export const sagaAfterLogin = function*() {
  yield all([initialize(), subscribeToHiveInfo()]);
};
