import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import promise from 'redux-promise';
import thunk from 'redux-thunk';


import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from '../reducers'; // the value from combineReducers

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, rootReducer);

//export const store = createStore(pReducer);
export const store = createStoreWithMiddleware(pReducer);
export const persistor = persistStore(store);