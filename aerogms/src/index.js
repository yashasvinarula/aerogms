import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import promise from 'redux-promise';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store = {createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
