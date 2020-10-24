const initialState = {
    listOfClient: [],
    clientDetails: [],
    clientDataById:[],
    common_message: "",
    color: "",
}

const ClientState = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_CLIENT_LIST":
            return { ...state, listOfClient: action.clientList }
        case "SAVE_CLIENT_DETAILS":
            return { ...state, clientDetails: action.clientDetails }
        case "DELETE_CLIENT_DETAILS":
            return { ...state, clientDetails: action.clientDetails }
        case "CHANGE_MASSAGE":
            return { ...state, common_message: action.message, color: action.color }
        case "SAVE_CLIENT_DETAILS_BY_ID":
            return { ...state, clientDataById: action.clientDetails }
        default:
            return state;
    }
}

export default ClientState;