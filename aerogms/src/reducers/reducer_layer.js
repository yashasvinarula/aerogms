import * as type from '../actions/types'
import _ from 'lodash';

const initialstate={};

export default function(state=initialstate, action){
    debugger
    switch(action.type){
        case type.GET_LAYERS:
            return _.mapKeys(action.payload.data, 'lay_id')
        case type.CREATE_LAYER:
            if(Object.keys(action.payload.data).length>0)
            return {...state, [action.payload.data.lay_id]:action.payload.data}
            else
            return state
        // case type.DELETE_PROJECT:
        //     let pro_id1 = action.payload.data;
        //     return _.omit(state, pro_id1)
        case type.RENAME_LAYER:
            let {lay_id, name} = action.payload.data;
            return {...state, [lay_id]:{...state[lay_id], name:name}}
        case type.RESET_LAYER_STORE:
            return state=initialstate;
        default:
            return state
    }
}