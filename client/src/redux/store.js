import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'; // import persist functions
import rootReducer from './reducers';
import persistConfig from './persistConfig';

const persistedReducer = persistReducer(persistConfig, rootReducer); // create a persisted reducer

const store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store); // create a persistor

export default store;
