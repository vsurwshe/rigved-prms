import { CreateInstance, HeaderConfig } from '../../assets/config/APIConfig';
import { SuccessFunction, ErrorFunction } from "./CommonAction"

const GetSkillSet=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/masterdata/SkillSet/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveSkillSet, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetSkillCategory=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/masterdata/SkillCategory/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveSkillCategory, "loadMessage":loadMessage, response}) })
            .catch(error => {  ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetDomains=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/masterdata/Domain/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveDomain, "loadMessage":loadMessage, response}) })
            .catch(error => {  ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetManagerList=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/masterdata/searchProjectMang/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveManagerList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetExpenseTypeList=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
            .get('/masterdata/Expense Type/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveExpenseSet, "loadMessage":loadMessage, response}) })
            .catch(error => {  ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetEmployeeList = (firstIndex, lastIndex,authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/masterdata/searchEmployee/' + firstIndex + '/' + lastIndex, HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": saveEmployeeList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetRoleList = (firstIndex, lastIndex,authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/masterdata/role/' + firstIndex + '/' + lastIndex, HeaderConfig(authroizationKey))
            .then(response =>{ SuccessFunction({ dispatch , "successMethod": saveRoleList, "loadMessage":loadMessage, response})})
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

//----------------------------------
export function saveSkillSet(SkillSet){
    return {
        type:"SAVE_SKILL_SET",
        SkillSet
    }
}

export function saveSkillCategory(SkillCategory){
    return {
        type:"SAVE_SKILL_CATEGORY_SET",
        SkillCategory
    }
}

export function saveDomain(Domains){
    return {
        type:"SAVE_DOMAIN_SET",
        Domains
    }
}

export function saveManagerList(ManagerList){
    return {
        type:"SAVE_MANAGER_LIST",
        ManagerList
    }
}

export function saveExpenseSet(ExpenseTypeList){
    return {
        type:"SAVE_EXPENSE_TYPE_LIST",
        ExpenseTypeList
    }
}

export function saveEmployeeList(EmployeeList){
    return {
        type:"SAVE_EMPLOYEE_LIST",
        EmployeeList
    }
}

export function saveRoleList(RoleList){
    return {
        type:"SAVE_ROLE_LIST",
        RoleList
    }
}

export function loadMessage(color, message){
    return{
        type:"SET_NO_DATA",
        color,
        message
    }
}


export {
    GetSkillSet,
    GetSkillCategory,
    GetDomains,
    GetManagerList,
    GetExpenseTypeList,
    GetEmployeeList,
    GetRoleList
}