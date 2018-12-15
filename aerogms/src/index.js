import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import {persistor, store, history } from './store';
import { Router, Switch, Route } from 'react-router-dom';

//const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
//{createStoreWithMiddleware(rootReducers)}>
ReactDOM.render(
    (<Provider store = {store}>
    <Router history={history}>
        <Switch>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <Route path="/" component = {App} />
        </PersistGate>
        </Switch>
    </Router>
</Provider>
    ), document.getElementById('root'));
 registerServiceWorker();
