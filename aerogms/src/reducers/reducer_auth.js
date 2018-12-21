import * as type from '../actions/types';

const initialState ={
    username: "",
    email:"",
    status:"",
    isadmin:"",
    error:"",
    isLoggedIn: false
};

export default function(state = initialState, action){
    // debugger;
    console.log(action.payload);
    switch(action.type){
        case type.LOGIN:
            const {data} = action.payload;
            if(action.payload.data){ 
            return {...state, 
                        username:data.userfname,
                        email:data.email, 
                        status:data.status, 
                        isLoggedIn :true,
                        isadmin:data.isadmin}}
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