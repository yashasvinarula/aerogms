import * as type from '../actions/types'
import _ from 'lodash';

export default function(state={}, action){
    debugger
    if(type.GET_USERS === action.type || type.REMOVE_USER === action.type || type.TOGGLE_USER_STATUS === action.type){
        if(action.error )
        action.type = 'error';
    }
switch(action.type)
{
    case type.GET_USERS:
        return _.mapKeys(action.payload.data, 'u_id')
    case type.REMOVE_USER:
        let u_id = action.payload.data.u_id;
        return _.omit(state,u_id)
    case type.TOGGLE_USER_STATUS:
        let key = action.payload.data.message;
        return {...state, [key]:{...state[key], status: !state[key].status}}
    case 'error':
        return {...state, error:'unauthorised'}
    default:
        return state;
}
}

  // case type.GET_SUCCESS:
    //     debugger
    //     return _.omit(state, action.payload)
    // case type.GET_ERROR:
    //     debugger
    //     return {...state, error:'Unauthorized'}