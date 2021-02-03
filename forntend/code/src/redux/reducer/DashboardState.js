const initialState = {
    clientSerise: [],
    employeeClientSerise: [],
    projectSerise: [],
    billSerise:[
        {name:"Billed", value:"billed"},
        {name:"Revenue", value:"unbilled"}
    ],
    resourceSerise:[
        {name:"Hired", value:"hired"},
        {name:"Left", value:"left"}
    ],
    clientBillingData: [],
    clientEmployeeData:[],
    billedData:[
        { xaxis: 'Feb', billed:1000,  unbilled: 3000 },
        { xaxis: 'March', billed: 2000, unbilled: 1200 },
        { xaxis: 'April', billed: 2200, unbilled: 2400 }, 
        { xaxis: 'May', billed: 1500, unbilled: 1100 }, 
        { xaxis: 'Jun', billed: 6300, unbilled: 1200 }
    ],
    resourceData:[],
    clientRevenueData:[],
    projectRevenueData:[],
    purchaseOrderRevenueData:[
        { field:"PO 1", value:20},
        { field:"PO 2", value:30},
        { field:"PO 3", value:43},
        { field:"PO 4", value:17}
    ]
}

const DashboardState=(state = initialState, action)=>{
    switch (action.type) {
        case "SAVE_DASHBOARD_BILLING_DATA":
            let tempClientSerise = (action.BillingData) && action.BillingData.clientId
            let tempClientBillingData = (action.BillingData) && action.BillingData.clientData.map((item,key)=>{ return {...item, "xaxis": months[item.xaxis]} })
            return {...state, clientSerise: tempClientSerise, clientBillingData : tempClientBillingData }
        case "SAVE_DASHBOARD_EMPLOYEE_DATA":
            let tempClientEmployeeSerise = (action.EmployeeData) && action.EmployeeData.clientId
            let tempClientEmployeeData = (action.EmployeeData) && action.EmployeeData.clientData.map((item,key)=>{ return {...item, "xaxis": months[item.xaxis]} })
            return {...state, employeeClientSerise: tempClientEmployeeSerise, clientEmployeeData : tempClientEmployeeData }
        case "SAVE_DASHBOARD_RESOURCE_DATA":
            let tempResourceData = (action.ResourceData) && action.ResourceData.map((item,key)=>{ return {...item, "xaxis": months[item.xaxis]} })
            return {...state, resourceData: tempResourceData }
        case "SAVE_DASHBOARD_PROJECT_REVENUE_DATA":
            let tempProjectRevenueData = (action.ProjectRevenueData && action.ProjectRevenueData.clientData && action.ProjectRevenueData.clientData.length >0) && action.ProjectRevenueData.clientData.map((item,key)=>{ 
                return {"field": action.ProjectRevenueData.clientId[key].name, value: item[action.ProjectRevenueData.clientId[key].value]} 
            })
            return {...state, projectRevenueData: tempProjectRevenueData }
        case "SAVE_DASHBOARD_CLIENT_REVENUE_DATA":
            let tempClientRevenueData = (action.ClientRevenueData && action.ClientRevenueData.clientData && action.ClientRevenueData.clientData.length >0) && action.ClientRevenueData.clientData.map((item,key)=>{ 
                return {"field": action.ClientRevenueData.clientId[key].name, value: item[action.ClientRevenueData.clientId[key].value]} 
            })
            return {...state, clientRevenueData: tempClientRevenueData }
        default:
            return state;
    }
}

// this is month name array
var months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

export default DashboardState;
