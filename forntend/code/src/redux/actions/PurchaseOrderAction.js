import { CreateInstance, HeaderConfig } from '../../assets/config/APIConfig';
import { loadMessage } from "../actions/ClientAction";
import { SuccessFunction, ErrorFunction } from "./CommonAction"


const GetPurchaseOrderList=(firstIndex, lastIndex,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .get('/purchaseOrder/poList/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": SavePurchaseOrderList, "loadMessage":loadMessage, response}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const GetPurchaseOrderListByName=(firstIndex, lastIndex,clientName,authroizationKey)=>{
    let newClientName=clientName.replace(/\s+/g, '');
    return(dispatch)=>{
        return CreateInstance()
        .get('/purchaseOrder/search/'+newClientName+'/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": SavePurchaseOrderListByName, "loadMessage":loadMessage, response}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const SavePurchaseOrderDetails=(userData,authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .post('/purchaseOrder/create/',userData,{headers: { 
            'Content-Type': 'application/json',
            Authorization: authroizationKey 
        }})
        .then(response => { SuccessFunction({ dispatch , "successMethod": SavePurchaseOrderData, "loadMessage":loadMessage, response,"postMethod":true}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const DeletePurchaseOrder=(clientId, authroizationKey)=>{
    return(dispatch)=>{
        return CreateInstance()
        .get('/purchaseOrder/delete/'+clientId,HeaderConfig(authroizationKey))
        .then(response => { SuccessFunction({ dispatch , "successMethod": DeletePurchaseOrderDetails, "loadMessage":loadMessage, response}) })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

//-------------------------------------------------------

export function SavePurchaseOrderList(purchaseOrderList){
    return{
        type:"SAVE_PURCHASE_ORDER_LIST",
        purchaseOrderList
    }
}

export function SavePurchaseOrderListByName(purchaseOrderList){
    return{
        type:"SAVE_PURCHASE_ORDER_LIST_BY_NAME",
        purchaseOrderList
    }
}

export function SavePurchaseOrderData(purchaseOrderData){
    return{
        type:"SAVE_PURCHASE_ORDER_DATA",
        purchaseOrderData
    }
}

export function DeletePurchaseOrderDetails(purchaseOrderDetails){
    return{
        type: "DELETE_PURCHASE_ORDER_DETAILS",
        purchaseOrderDetails
    }
}

export {
    GetPurchaseOrderList,
    SavePurchaseOrderDetails,
    DeletePurchaseOrder,
    GetPurchaseOrderListByName   
}