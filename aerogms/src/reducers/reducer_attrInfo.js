import * as type from '../actions/types'
import _ from 'lodash';

const initialstate = {};

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
                case type.GET_FEATURE:
                    let data = action.payload;
                    return {...state, data}
                default:
                    return state
            }
        }
    }
    catch(error){
        console.log(action.payload.response.data.message);
    }
}