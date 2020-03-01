import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as _ from 'lodash';
import { rootSaga, sagaAfterLogin } from './saga-service';
import { ReduxState, ReduxActions } from '../models';

const sagaMiddleware = createSagaMiddleware();
const initialState: ReduxState = {
  userId: undefined,
  hiveData: undefined,
};

const reducer = (state: ReduxState = initialState, action: ReduxActions) => {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case 'SET_USER':
      newState.userId = action.userId;
      return newState;
    case 'SET_HIVE_DATA':
      newState.hiveData = action.hiveData;
      return newState;
    case 'RESET_REDUX':
      newState = initialState;
      return newState;
    default:
      return newState;
  }
};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(sagaMiddleware),
);

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export const startSagaAfterLogin = () => {
  sagaMiddleware.run(sagaAfterLogin);
};

export default store;
