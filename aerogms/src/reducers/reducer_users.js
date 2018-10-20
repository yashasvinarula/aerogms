import * as type from '../actions/types'
import _ from 'lodash';

export default function(state={}, action){
switch(action.type)
{
    case type.GET_USERS:
        return _.mapKeys(action.payload.data, 'u_id')
    case type.REMOVE_USER:
        return _.omit(state, action.payload)
    case type.TOGGLE_USER_STATUS:
    debugger
    //const key = action.payload;
        return {...state, [action.payload]:{...state[action.payload], status: !state[action.payload].status}}
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