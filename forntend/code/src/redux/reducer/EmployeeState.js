const initialState = {
    employeeListByPojectId: [],
    employeeListByRateCardId: [],
    employeeDetails:[]
}

const EmployeeState=(state=initialState,action)=>{
    switch (action.type) {
        case "SAVE_EMPOLYEE_BY_PROJECT_ID":
            let newEmployeeListByProjectId =state.employeeListByPojectId.filter(item=> item.projectId !== action.projectId); 
            return {...state, employeeListByPojectId: [...newEmployeeListByProjectId,{"List":action.employeeList,"projectId": action.projectId}]}
        case "SAVE_EMPOLYEE_BY_RATECARD_ID":
            return {...state, employeeListByRateCardId: action.employeeList}
        case "SAVE_EMPLOYEE_DETAILS":
            return {...state, employeeDetails: action.employeeDetails}
        case "EDIT_EMPLOYEE_DETAILS":
            return {...state, employeeDetails: action.employeeDetails}
        case "DELETE_EMPLOYEE_DETAILS":
            return {...state, employeeDetails: action.employeeDetails}    
        default:
            return state;
    }
}

export default EmployeeState;
