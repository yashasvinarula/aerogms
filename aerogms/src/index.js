import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//import {createStore, applyMiddleware} from 'redux';
//import promise from 'redux-promise';
//import rootReducers from './reducers';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import {persistor, store } from './store';

//const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
//{createStoreWithMiddleware(rootReducers)}>
ReactDOM.render(
    <Provider store = {store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
    </PersistGate>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
