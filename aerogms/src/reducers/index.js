import {combineReducers} from 'redux';
import authReducer from './reducer_auth';
import usersReducer from './reducer_users';
import projectReducer from './reducer_project';
import * as type from '../actions/types';
import storage from 'redux-persist/lib/storage';
import layerReducer from './reducer_layer';


// const rootReducer = combineReducers({
//     userDetails: authReducer,
//     users:usersReducer
// });

const AppReducer = combineReducers({
    userDetails: authReducer,
    users:usersReducer,
    projects:projectReducer,
    layers:layerReducer
});

const rootReducer = (state, action)=>{
    if(action.type === type.LOGOUT){
        Object.keys(state).forEach(key => {
            storage.removeItem(`persist:${key}`);
        });
        state = undefined;
    }
    return AppReducer(state, action);
}

export default rootReducer;