import { CreateInstance, HeaderConfig } from '../../assets/config/APIConfig';
import { SuccessFunction, ErrorFunction } from "./CommonAction"

// this method will get client list
const GetClientList=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/client/clientList/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveClientList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will save client details
const SaveClientData=(userData,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .post('/client/create/',userData,{
            headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }
        })
        .then(response => { SuccessFunction({ dispatch , "successMethod": SaveClientDetails, "loadMessage":loadMessage, response, "postMethod":true}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will get client details by id
const GetClientDetailsById=(clientId, authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/client/read/'+clientId,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveClientDetailsById, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will delete client details
const DeleteClient=(clientId, authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .get('/client/delete/'+clientId,HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": DeleteClientDetails, "loadMessage":loadMessage, response}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

//------------------------------------

export function SaveClientList(clientList){
    return{
        type: "SAVE_CLIENT_LIST",
        clientList
    }
}

export function SaveClientDetails(clientDetails){
    return{
        type: "SAVE_CLIENT_DETAILS",
        clientDetails
    }
}

export function SaveClientDetailsById(clientDetails){
    return{
        type: "SAVE_CLIENT_DETAILS_BY_ID",
        clientDetails
    }
}

export function DeleteClientDetails(clientDetails){
    return{
        type: "DELETE_CLIENT_DETAILS",
        clientDetails
    }
}

export function loadMessage(color,message){
    return{
        type:"CHANGE_MASSAGE",
        message,
        color
    }
}


export{
    GetClientList,
    SaveClientData,
    GetClientDetailsById,
    DeleteClient
}

