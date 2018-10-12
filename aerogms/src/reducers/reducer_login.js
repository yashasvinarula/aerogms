import {LOGIN} from '../actions';

const initialState ={
    username: "",
    isLoggedIn: false
};

export default function(state = [], action){
    debugger;
    console.log(action.payload);
    switch(action.type){
        case LOGIN:
            return [action.payload.data, {isLoggedIn :true}, ...state ]
        default:
            return state;
    }

}