import * as type from '../actions/types';
import _ from 'lodash';
import { stat } from 'fs';

const initialState={};

export default function(state=initialState, action){
debugger
    switch(action.type){
        case type.GET_USER_COMPLAINTS:
            return _.mapKeys(action.payload, 'comp_id');
        case type.ADD_USER_COMPLAINT:
            if(Object.keys(action.payload).length>0)
            return {...state, [action.payload[0].comp_id]:action.payload[0]}
            else
            return state
        default:
            return state;
    }
}