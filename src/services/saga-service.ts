import { all, take, put, call, select } from 'redux-saga/effects';
import { ReduxState, ReduxActions } from '../models';
import { channel } from 'redux-saga';
import { subscribeToHive, updateIdea } from './firebase-service';

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

function* takeHiveChannel() {
  while (true) {
    const action = yield take(hiveChannel);
    yield put(action);
  }
}

export const rootSaga = function*() {
  yield all([takeHiveChannel()]);
};

export const sagaAfterLogin = function*() {
  yield all([initialize(), subscribeToHiveInfo()]);
};
