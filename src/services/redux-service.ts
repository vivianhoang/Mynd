import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as _ from 'lodash';
import saga from './saga-service';

const sagaMiddleware = createSagaMiddleware();
const initialState = {
  categories: [],
};

const reducer = (state, action) => {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case 'GET_CATEGORIES':
      console.log(action);
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

sagaMiddleware.run(saga);

export default store;
