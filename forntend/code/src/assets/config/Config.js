const API_URL=process.env.REACT_APP_API_BASE_URL;
const API_EXE_TIME=500;
const API_INVOCIE_EXE_TIME=1000;

const AlertColor={
    success:"success",
    danger:"error",
    warning: "warning"
}

const FromActions={
    "CR":"CREATE",
    "VI": "VIEW",
    "ED":"EDIT",
    "DE":"DELETE",
    "VIED":"VIEWEDIT"
}

const ProjectBillingModelType={
    MILE_STONE:"Mile Stone",
    // Fixed Type
    FIXED_TYPE:"Fixed Rate",
    PAYABLES_DAY:"Payable Days",
    CLIENT_BILLING:"Client Billing"
}

const ResponseBillingModelType={
    MILE_STONE:"Mile Stone",
    FIXED_TYPE:"Fixed Type",
    PAYABLES_DAY:"Payable Days",
    CLIENT_BILLING:"Client Billing"
}

export{
    API_URL,
    AlertColor,
    API_EXE_TIME,
    FromActions,
    API_INVOCIE_EXE_TIME,
    ProjectBillingModelType,
    ResponseBillingModelType
}