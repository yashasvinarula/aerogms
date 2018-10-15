import * as type from '../actions/types';

const initialState ={
    username: "",
    email:"",
    status:"",
    error:"",
    isLoggedIn: false
};

export default function(state = initialState, action){
    debugger;
    console.log(action.payload);
    switch(action.type){
        case type.LOGIN:
            if(action.payload.data){ 
            return {...state, 
                        username:action.payload.data.userfname, 
                        email:action.payload.data.email, 
                        status:action.payload.data.status, 
                        isLoggedIn :true}}
            else{
            return {...state, 
                    error:action.payload.response.data, 
                    isLoggedIn :false}}
                    
        case type.LOGOUT:
            return initialState;
        default:
            return state;
    }
}