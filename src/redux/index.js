import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { authReducer } from "./../auth";

const staticReducers = {
  auth: authReducer,
};
class ConfigureStore {
  constructor(initialReducers, initialState) {
    const middlewares = [thunk];
    const middlewareEnhancers = applyMiddleware(...middlewares);
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancers = [middlewareEnhancers];
    const composedEnhancers = composeEnhancers(...enhancers);

    this.reduce = this.reduce.bind(this);
    this.add = this.add.bind(this);

    this.reducers = { ...initialReducers };
    this.combinedReducer = combineReducers(this.reducers);
    this.keysToRemove = [];
    this.store = createStore(this.reduce, initialState, composedEnhancers);
  }

  reduce(state, action) {
    // If any reducers have been removed, clean up their state first
    if (this.keysToRemove?.length > 0) {
      state = { ...state };
      for (let key of this.keysToRemove) {
        delete state[key];
      }
      this.keysToRemove = [];
    }

    // Delegate to the combined reducer
    return this.combinedReducer(state, action);
  }

  getReducerMap() {
    return this.reducers;
  }

  add(key, reducer) {
    if (!key || this.reducers[key]) {
      return;
    }

    // Add the reducer to the reducer mapping
    this.reducers[key] = reducer;

    // Generate a new combined reducer
    this.combinedReducer = combineReducers(this.reducers);
    this.store.replaceReducer(this.combinedReducer);
  }

  remove(key) {
    if (!key || !this.reducers[key]) {
      return;
    }

    // Remove it from the reducer mapping
    delete this.reducers[key];

    // Add the key to the list of keys to clean up
    this.keysToRemove.push(key);

    // Generate a new combined reducer
    this.combinedReducer = combineReducers(this.reducers);
    this.store.replaceReducer(this.combinedReducer);
  }
}

const rootStore = new ConfigureStore(staticReducers);

export default rootStore;
