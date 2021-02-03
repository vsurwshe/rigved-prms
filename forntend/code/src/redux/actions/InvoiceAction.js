import {AlertColor, ProjectBillingModelType} from '../../assets/config/Config';
import { CreateInstance, HeaderConfig } from '../../assets/config/APIConfig';
import { loadMessage } from "../actions/ClientAction";
import { SuccessFunction, ErrorFunction } from "./CommonAction"
import { InvoiceError } from '../../assets/config/ErrorStringFile';

// this method will used to fetch invoice list by id
const GetInvoiceUserList = (firstIndex, lastIndex, invoiceId, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/innvoice/invoiceList/' + firstIndex + '/' + lastIndex+'/'+invoiceId, HeaderConfig(authroizationKey))
            .then(response => { 
                if(response && response.headers && response.headers.billing_type){
                    SuccessFunction({ dispatch , "successMethod": SaveSingleInvoiceData, "loadMessage":loadMessage, response ,"id":response.headers.billing_type}) 
                }else{
                    SuccessFunction({ dispatch , "successMethod": SaveSingleInvoiceData, "loadMessage":loadMessage, response}) 
                }  
            })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will used for fetch data accroding to billing model before creating invoice
const GenerateInvoice = (invoiceData, authroizationKey, projectType) => {
    return (dispatch) => {
        return CreateInstance()
            .post('/innvoice/create/',invoiceData,{headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }})
            .then(response => { 
                switch (response && response.data && response.data.Status) {
                    case "NO_CONTENT":
                        return dispatch(loadMessage(AlertColor.danger, InvoiceError.NO_CONTENT));  
                    case "CONFLICT":
                        return dispatch(loadMessage(AlertColor.danger, InvoiceError.CONFLICT + response.data.fromDate +" to "+response.data.toDate)); 
                    case "INTERNAL_SERVER_ERROR":
                        return dispatch(loadMessage(AlertColor.danger, InvoiceError.INTERNAL_SERVER_ERROR)); 
                    default:
                        switch (projectType) {
                            case ProjectBillingModelType.MILE_STONE:
                                return SuccessFunction({ dispatch , "successMethod": saveMileStonePreInvoiceData, "loadMessage":loadMessage, response})         
                            case ProjectBillingModelType.FIXED_TYPE:
                                return SuccessFunction({ dispatch , "successMethod": saveFixedCostPreInvoiceData, "loadMessage":loadMessage, response})
                            case ProjectBillingModelType.PAYABLES_DAY:
                                return SuccessFunction({ dispatch , "successMethod": savePayableDaysPreInvoiceData, "loadMessage":loadMessage, response})
                            case ProjectBillingModelType.CLIENT_BILLING:
                                return SuccessFunction({ dispatch , "successMethod": saveClientBillingPreInvoiceData, "loadMessage":loadMessage, response})
                            default:
                                return "";
                        }
                }
            })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will used to get details accroding to invoice id
const GetPDFInvoiceData = (invoiceId, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/innvoice/create/'+invoiceId,{headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }})
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveInvoiceEmployeeData, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will used for the genrate the pdf data for selecting data
const GenerateInvoicePDF = (invoiceData, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .post('/innvoice/createPDF/',invoiceData,{headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }})
            .then(response => { 
                switch (response && response.data && response.data.Status) {
                    case "NO_CONTENT":
                        return dispatch(loadMessage(AlertColor.danger, InvoiceError.NO_CONTENT));  
                    case "CONFLICT":
                        return dispatch(loadMessage(AlertColor.danger, InvoiceError.CONFLICT + response.data.fromDate +" to "+response.data.toDate)); 
                    case "INTERNAL_SERVER_ERROR":
                        return dispatch(loadMessage(AlertColor.danger, InvoiceError.INTERNAL_SERVER_ERROR));
                    default:
                        return SuccessFunction({ dispatch , "successMethod": SaveInvoiceEmployeeData, "loadMessage":loadMessage, response}) 
                }
            })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will used for get list of invoice pdf data list
const getPDFInvoiceList=(firstIndex, lastIndex,authroizationKey)=>{
    return (dispatch) => {
        return CreateInstance()
            .get('/innvoice/invoicePDFData/'+firstIndex+'/'+lastIndex,HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": SavePDFInvoiceList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will used get single data for invoice pdf data id
const viewInvoicePDFData = (invoiceId, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/innvoice/invoicePDFData/'+invoiceId,{headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }})
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveInvoiceEmployeeData, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

// this method will used to call pay invoice  
const payInvoiceBill = (invoiceId, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .get('/innvoice/invoicePaid/' + invoiceId, HeaderConfig(authroizationKey))
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveInvoiceUserList, "loadMessage":loadMessage, response}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}


//-------------------------------------

export function SaveSingleInvoiceData(invoiceData, billingType) {
    return {
        type: "SAVE_SINGLE_INVOICE_DATA",
        invoiceData,
        billingType
    }
}

export function SaveInvoiceUserList(invoiceList) {
    return {
        type: "SAVE_INVOICE_USER_LIST",
        invoiceList
    }
}

export function SavePDFInvoiceList(invoiceList) {
    return {
        type: "SAVE_INVOICE_PDF_LIST",
        invoiceList
    }
}

export function SaveInvoiceEmployeeData(invoiceData) {
    return {
        type: "SAVE_INVOICE_EMPLOYEE_DATA",
        invoiceData
    }
}

export function SavePDFInvoiceData(invoiceData) {
    return {
        type: "SAVE_PDF_INVOICE_DATA",
        invoiceData
    }
}

export function SaveGenratedInvoiceData(invoiceData) {
    return {
        type: "SAVE_INVOICE_CREATE_PDF",
        invoiceData
    }
}

export function SaveViewInvoicePDFData(invoiceData) {
    return {
        type: "SAVE_VIEW_INVOICE_PDF",
        invoiceData
    }
}

export function SavePaidInvoiceData(invoiceData) {
    return {
        type: "SAVE_PAY_INVOICE_DATA",
        invoiceData
    }
}

export function saveMileStonePreInvoiceData(mileStones) {
    return{
        type: "SAVE_MILESTONE_PRE_INVOICE_DATA",
        mileStones
    }
}

export function saveFixedCostPreInvoiceData(fixedCost) {
    return{
        type: "SAVE_FIXED_COST_PRE_INVOICE_DATA",
        fixedCost
    }
}

export function savePayableDaysPreInvoiceData(payableDays) {
    return{
        type: "SAVE_PAYABLE_DAYS_PRE_INVOICE_DATA",
        payableDays
    }
}

export function saveClientBillingPreInvoiceData(clientBilling) {
    return{
        type: "SAVE_CLIENT_BILLING_PRE_INVOICE_DATA",
        clientBilling
    }
}

export{
    GetInvoiceUserList,
    GenerateInvoice,
    GenerateInvoicePDF,
    GetPDFInvoiceData,
    viewInvoicePDFData,
    getPDFInvoiceList,
    payInvoiceBill
}
