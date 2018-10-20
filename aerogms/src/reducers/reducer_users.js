import * as type from '../actions/types'
import _ from 'lodash';

export default function(state={}, action){
switch(action.type)
{
    case type.GET_USERS:
        return _.mapKeys(action.payload.data, 'u_id')
    default:
        return state;
}
}