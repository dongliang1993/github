import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {userInitialState, userReducer} from './reducers'

const reducer = combineReducers({
  user: userReducer
});

export const initializeStore = preloadedState => {
  return createStore(
      reducer,
      Object.assign({}, {user: userInitialState}, preloadedState),
      applyMiddleware(thunk)
  )
};
