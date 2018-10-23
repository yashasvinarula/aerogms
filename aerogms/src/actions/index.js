import axios from 'axios';
import * as type from './types';

export function doLogin(username, pwd, callback){
    const request = axios.post(`${type.ROOT_URL}/login`,
    { username: username, password: pwd});

    return {
        type: type.LOGIN,
        payload: request//{something: 'Here is some data'}
    }
}
export function doLogout(){
    const request = axios.get(`${type.ROOT_URL}/logout`);
    return {
        type: type.LOGOUT,
        payload: request
    }
}

export function getUsers(){
    const request = axios.get(`${type.ROOT_URL}/userlist`, {credentials: 'include'});
    return{
        type:type.GET_USERS,
        payload: request
    }
}

// function getStuffSuccess(result) {
//     return {
//       type: type.GET_SUCCESS,
//       payload: result
//     }
//   }
  
// function getStuffError(err) {
//     return {
//       type: type.GET_ERROR,
//       payload: err
//     }
//   }
  

export function removeUser(u_id){
    debugger
    // return function(dispatch){
    //     axios.delete(`${type.ROOT_URL}/removeUser`, {params:{u_id}})
    //     .then((result)=>{
    //         debugger
    //         dispatch(getStuffSuccess(result))
    //     })
    //     .catch((err)=>{
    //         debugger
    //     dispatch(getStuffError(err))
    //     })
    // }

    //const request = axios.post(`${type.ROOT_URL}/removeUser`, {params:{u_id}});
    const request = axios.delete(`${type.ROOT_URL}/removeUser`, {params:{u_id}});
    return {
        type: type.REMOVE_USER,
        payload: request
    }
}

export function toggleUserStatus(u_id){
    const request = axios.patch(`${type.ROOT_URL}/toggleUserStatus`, {u_id});
    return{
        type: type.TOGGLE_USER_STATUS,
        payload:request
    }
}
