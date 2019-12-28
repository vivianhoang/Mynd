import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as _ from 'lodash';
import saga from './saga-service';
import { ReduxState, ReduxActions } from '../models';

const sagaMiddleware = createSagaMiddleware();
const initialState: ReduxState = {
  categories: [],
  notesByCategoryId: {},
};

const reducer = (state: ReduxState, action: ReduxActions) => {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case 'SET_CATEGORIES':
      {
        newState.categories = action.categories;
      }
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
  sagaMiddleware.run(saga);
};

export default store;
