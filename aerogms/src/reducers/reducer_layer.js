import * as type from '../actions/types'
import _ from 'lodash';
import { stat } from 'fs';

const initialstate={};

export default function(state=initialstate, action){
    debugger
    try
    {
        if(action.error)
        {
            let {message, status} = action.payload.response.data;
            return {...state, error:{message, status}}
        }
        else
        {
            switch(action.type){
                case type.GET_LAYERS:
                    return _.mapKeys(action.payload.data, 'lay_id')
                case type.CREATE_LAYER:
                    if(Object.keys(action.payload.data).length > 0)
                    return {...state, [action.payload.data.lay_id]:action.payload.data}
                    else
                    return state
                case type.DELETE_LAYER:
                    let {layId} = action.payload.data;
                    return _.omit(state, layId);
                case type.RENAME_LAYER:
                    let {lay_id, name} = action.payload.data;
                    return {...state, [lay_id]:{...state[lay_id], name:name}}
                case type.UPDATE_LAYER_COLOR:
                    let co_layid = action.payload.data.lay_id;
                    let color = action.payload.data.color;
                    return {...state, [co_layid]:{...state[co_layid], color:color}}
                case type.RESET_LAYER_STORE:
                    return state=initialstate;
                default:
                    return state
            
            }
        }
    }
    catch(error){
        console.log(action.payload.response.data.message);
    }
}