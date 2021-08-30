import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { authReducer } from "./../auth";

const staticReducers = {
  auth: authReducer,
};

// const configureStore = (initialState) => {
//   const middlewares = [thunk];
//   const middlewareEnhancers = applyMiddleware(...middlewares);
//   const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   const enhancers = [middlewareEnhancers];
//   const composedEnhancers = composeEnhancers(...enhancers);
//   const store = createStore(
//     reducerManager.reduce,
//     initialState,
//     composedEnhancers
//   );
//   const reducerManager = createReducerManager(staticReducers, store);
//   const createReducerManager = (initialReducers) => {
//     // Create an object which maps keys to reducers
//     const reducers = { ...initialReducers };

//     // Create the initial combinedReducer
//     let combinedReducer = combineReducers(reducers);

//     // An array which is used to delete state keys when reducers are removed
//     let keysToRemove = [];

//     return {
//       getReducerMap: () => reducers,

//       // The root reducer function exposed by this object
//       // This will be passed to the store
//       reduce: (state, action) => {
//         // If any reducers have been removed, clean up their state first
//         if (keysToRemove.length > 0) {
//           state = { ...state };
//           for (let key of keysToRemove) {
//             delete state[key];
//           }
//           keysToRemove = [];
//         }

//         // Delegate to the combined reducer
//         return combinedReducer(state, action);
//       },

//       // Adds a new reducer with the specified key
//       add: (key, reducer) => {
//         if (!key || reducers[key]) {
//           return;
//         }

//         // Add the reducer to the reducer mapping
//         reducers[key] = reducer;

//         // Generate a new combined reducer
//         combinedReducer = combineReducers(reducers);
//         store.replaceReducer(combineReducers);
//       },

//       // Removes a reducer with the specified key
//       remove: (key) => {
//         if (!key || !reducers[key]) {
//           return;
//         }

//         // Remove it from the reducer mapping
//         delete reducers[key];

//         // Add the key to the list of keys to clean up
//         keysToRemove.push(key);

//         // Generate a new combined reducer
//         combinedReducer = combineReducers(reducers);
//         store.replaceReducer(combineReducers);
//       },
//     };
//   };

//   store.reducerManager = reducerManager;

//   return store;
// };

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
    console.log("reducers: ", this.reducers);
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
