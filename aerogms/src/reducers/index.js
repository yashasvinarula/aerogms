import {combineReducers} from 'redux';
import authReducer from './reducer_auth';

const rootReducer = combineReducers({
    userDetails: authReducer
});

export default rootReducer;