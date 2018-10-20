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
    const request = axios.get(`${type.ROOT_URL}/userlist`);
    return{
        type:type.GET_USERS,
        payload: request
    }
}