import axios from 'axios';
export const LOGIN = 'login';
const ROOL_URL = 'http://localhost:3001/api/';

export function doLogin(username, pwd){
    const request = axios.post(`${ROOL_URL}login`,
    { username: username, password: pwd});

    return {
        type: LOGIN,
        payload: request//{something: 'Here is some data'}
    }
}