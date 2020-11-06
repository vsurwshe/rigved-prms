import { CreateInstance, HeaderConfig } from '../../assets/config/APIConfig';
import { loadMessage } from "../actions/ClientAction";
import { SuccessFunction, ErrorFunction } from "./CommonAction"


const GetProjectList = (firstIndex, lastIndex, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/project/projectList/' + firstIndex + '/' + lastIndex, HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveProjectList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetProjectListByClient = (firstIndex, lastIndex, clientId, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/project/projectList/' +firstIndex + '/' + lastIndex+'/'+clientId, HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveProjectListByClient, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const SaveProjectRecord=(userData,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .post('/project/createProj/',userData,{headers: { 
            'Content-Type': 'application/json',
            Authorization: authroizationKey 
        }})
        .then(response => { SuccessFunction({ dispatch , "successMethod": SaveProject, "loadMessage":loadMessage, response, "postMethod":true}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const DeleteProjectRecord=(projectId, authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .get('/project/delete/'+projectId,HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": DeleteProject, "loadMessage":loadMessage, response}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

//-------------------------------

export function SaveProjectList(projectList) {
    return {
        type: "SAVE_PROJECT_LIST",
        projectList
    }
}

export function SaveProjectListByClient(projectList) {
    return {
        type: "SAVE_PROJECT_LIST_BY_CLIENT",
        projectList
    }
}

export function SaveProject(projectData) {
    return {
        type: "SAVE_PROJECT_DATA",
        projectData
    }
}

export function DeleteProject(projectData){
    return {
        type: "DELETE_PROJECT_DATA",
        projectData
    }
}

export {
    GetProjectList,
    GetProjectListByClient,
    SaveProjectRecord,
    DeleteProjectRecord
}