import { all } from 'redux-saga/effects';

function* initialize() {
  console.log('Initialize app');
}

export default function* rootSaga() {
  yield all([initialize()]);
}
