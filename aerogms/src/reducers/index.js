import {combineReducers} from 'redux';
import LoginReducer from './reducer_login';

const rootReducer = combineReducers({
    userDetails: LoginReducer
});

export default rootReducer;