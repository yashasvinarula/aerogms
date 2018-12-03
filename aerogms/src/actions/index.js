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
    // debugger
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

export function createProject(pro_name, owner_email){
    const request = axios.post(`${type.ROOT_URL}/create_project`, {
        pro_name:pro_name,
        owner_email:owner_email
    })

    return{
        type:type.CREATE_PROJECT,
        payload:request
    }
}

export function getProjects(owner_email){
    const request = axios.post(`${type.ROOT_URL}/get_projects`, {
        owner_email:owner_email
    })

    return{
        type:type.GET_PROJECTS,
        payload:request
    }
}

export function deleteProject(pro_id){
    const request = axios.post(`${type.ROOT_URL}/delete_project`, {
        pro_id:pro_id
    })

    return{
        type:type.DELETE_PROJECT,
        payload:request
    }
}

export function renameProject(pro_id, pro_name){
    const request = axios.post(`${type.ROOT_URL}/rename_project`, {
        pro_id:pro_id,
        pro_name:pro_name
    })

    return{
        type:type.RENAME_PROJECT,
        payload:request
    }
}

export function create_layer(lay_name, lay_type, pro_id, mail_id, geom){
    const request = axios.post(`${type.ROOT_URL}/create_layer`, {
        name: lay_name,
        type: lay_type,
        pro_id:pro_id,
        user_id: mail_id,
        geom:geom
    })

    return{
        type: type.CREATE_LAYER,
        payload: request
    }
}

export function rename_layer(lay_id, lay_name){
    const request = axios.post(`${type.ROOT_URL}/rename_layer`, {
        lay_id:lay_id,
        name: lay_name
    })

    return{
        type: type.RENAME_LAYER,
        payload: request
    }
}

export function get_layers(pro_id, user_id){
    const request = axios.post(`${type.ROOT_URL}/get_layers`, {
        pro_id:pro_id,
        u_id: user_id
    })

    return{
        type:type.GET_LAYERS,
        payload:request
    }
}

export function delete_layer(layName, layId){
    const request = axios.post(`${type.ROOT_URL}/delete_layer`, {
        layer_name:layName,
        lay_id:layId
    })

    return{
        type: type.DELETE_LAYER,
        payload: request
    }
}

export function resetLayerStore(){
    return {
        type: type.RESET_LAYER_STORE,
        payload: null
    }
}

export function getUserComplaints(complaintObj){
    return{
        type: type.GET_USER_COMPLAINTS,
        payload: [complaintObj]
    }
}

export function addUserComplaint(complaintObj){
    return{
        type: type.ADD_USER_COMPLAINT,
        payload: [complaintObj]
    }
}

export function makelayerafterimport(data){
    var data = {data}
    return{
        type: type.CREATE_LAYER,
        payload: data
    }
}

export function makeLayerActive(data){
    debugger
    return{
        type: type.MAKE_ACTIVE_LAYER,
        payload: data
    }
}

export function updateLayerActive(data){
    debugger
    return{
        type: type.UPDATE_ACTIVE_LAYER,
        payload: data
    }
}

export function updateLayerColor(layId, color){
    debugger
    const request = axios.post(`${type.ROOT_URL}/update_layer_color`, {
        lay_id:layId,
        color:color,
    })

    return{
        type: type.UPDATE_LAYER_COLOR,
        payload: request
    }
}