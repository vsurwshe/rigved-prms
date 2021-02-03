const initialState = {
    invoiceList: [],
    invoiceUserList: [],
    invoiceDetails: [],
    invoiceEmployeeData:[],
    genratedInvoiceData:[],
    pdfInvoiceData:[],
    viewPDFInvoiceData:[],
    preInvoiceMileStonesData:[],
    preInvoiceFixedCostData:[],
    preInvoicePayablesData:[],
    preInvoiceClientBillingData:[],
    projectBillingType:""
}

const InvoiceState=(state=initialState,action)=>{
    switch (action.type) {
        case "SAVE_INVOICE_LIST":
            return {...state,invoiceList:action.invoiceList}
        case "SAVE_MILESTONE_PRE_INVOICE_DATA":
            return {...state,preInvoiceMileStonesData:action.mileStones}
        case "SAVE_FIXED_COST_PRE_INVOICE_DATA":
            return {...state,preInvoiceFixedCostData:action.fixedCost}
        case "SAVE_PAYABLE_DAYS_PRE_INVOICE_DATA":
            return {...state,preInvoicePayablesData:action.payableDays}
        case "SAVE_CLIENT_BILLING_PRE_INVOICE_DATA":
            return {...state,preInvoiceClientBillingData:action.clientBilling}
        case "SAVE_INVOICE_PDF_LIST":
            return {...state,invoiceList:action.invoiceList}
        case "SAVE_INVOICE_USER_LIST":
            return {...state,invoiceUserList:action.invoiceList}
        case "SAVE_INVOICE_EMPLOYEE_DATA":
            return {...state,invoiceEmployeeData:action.invoiceData}
        case "SAVE_INVOICE_CREATE_PDF":
            return {...state,genratedInvoiceData:action.invoiceData}
        case "SAVE_PDF_INVOICE_DATA":
            return {...state,pdfInvoiceData:action.invoiceData}
        case "SAVE_VIEW_INVOICE_PDF":
            return {...state,viewPDFInvoiceData:action.invoiceData}
        case "SAVE_SINGLE_INVOICE_DATA":
            return {...state,invoiceUserList:action.invoiceData,projectBillingType:action.billingType}
        default:
            return state;
    }
}

export default InvoiceState;
