import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import reducer from '../reducers';
import thunk from 'redux-thunk';

const configureStore = ( initialState, history ) => {
  
  const middlewareHistory = routerMiddleware(history);

  const store = createStore(
    combineReducers({
      reducer,
      routing: routerReducer
    }),
    initialState,
    applyMiddleware(
      middlewareHistory,
      thunk )
    );

  return store;
}

export default configureStore;
