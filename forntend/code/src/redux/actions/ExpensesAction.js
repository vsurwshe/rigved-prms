import { CreateInstance, HeaderConfig } from '../../assets/config/APIConfig';
import { loadMessage } from "../actions/ClientAction";
import { SuccessFunction, ErrorFunction } from "./CommonAction"

const GetExpensesList = (firstIndex, lastIndex, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/project/expenseList/' + firstIndex + '/' + lastIndex, HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveExpenseList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetExpensesListByProjectId = (firstIndex, lastIndex,projectId, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
        .get('/project/expenseList/' + firstIndex + '/' + lastIndex+ '/' +projectId, HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": saveExpenseListByProjectId, "loadMessage":loadMessage, response ,"id":projectId}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const SaveExpenseRecord=(userData,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .post('/project/createExp/',userData,{
            headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }
        })
        .then(response => { SuccessFunction({ dispatch , "successMethod": saveExpenseRecord, "loadMessage":loadMessage, response, "postMethod":true}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const DeleteExpenseRecord=(expenseId, authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .get('/project/deleteExp/'+expenseId,HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": deleteProject, "loadMessage":loadMessage, response}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}
    
//------------------------------------
export function saveExpenseList(expenseList){
    return {
        type:"SAVE_EXPENSES_LIST",
        expenseList   
    }
}

export function saveExpenseRecord(expenseRecord){
    return{
        type:"SAVE_EXPENSE_RECORD",
        expenseRecord
    }
}

export function saveExpenseListByProjectId(expenseList,projectId){
    return {
        type:"SAVE_EXPENSES_LIST_BY_PROJECT_ID",
        expenseList,
        projectId
    }
}

export function deleteProject(expenseData){
    return{
        type:"DELETE_EXPENSE_DATA",
        expenseData
    }
}

export{
    GetExpensesList,
    SaveExpenseRecord,
    GetExpensesListByProjectId,
    DeleteExpenseRecord
}