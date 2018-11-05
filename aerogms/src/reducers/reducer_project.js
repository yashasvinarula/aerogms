import * as type from '../actions/types'
import _ from 'lodash';

const initialstate={};

export default function(state=initialstate, action){
    // debugger
    // if(action.payload){
    //     if(action.payload.data === 'projectnameexists'){
    //         action.type = 'error'
    //     }
    // }
    
    switch(action.type){
        case type.GET_PROJECTS:
            return _.mapKeys(action.payload.data, 'pro_id')
        case type.CREATE_PROJECT:
            if(Object.keys(action.payload.data).length>0)
            return {...state, [action.payload.data.pro_id]:action.payload.data}
            else
            return state
        case type.DELETE_PROJECT:
            let pro_id1 = action.payload.data;
            return _.omit(state, pro_id1)
        case type.RENAME_PROJECT:
            let {pro_id, pro_name} = action.payload.data;
            return {...state, [pro_id]:{...state[pro_id], pro_name:pro_name}}
        // case 'error':
        //     return {...state, error:action.payload.data}
        default:
            return state
    }
}