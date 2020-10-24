const initialState = {
    sidebarShow: 'responsive',
    role: "",
    account_id: "",
    authorization: "",
    common_message: "",
    color:"",
    saveUserData: [],
    userData:[]
}
  
const LoginState = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return { ...state }
    case 'USER_LOGIN':
      return { ...state, role: action.role }
    case "SET_ACCOUNT_ID":
      return { ...state, account_id: action.account_id, authorization: action.authorization }
    case "CHANGE_MASSAGE":
      return { ...state, common_message: action.message, color: action.color }
    case "USER_SAVED":
      return {...state, saveUserData: action.saveUserData}
    case "SAVE_USER_DATA":
      return {...state, userData: action.userData}
    default:
      return state
  }
}

export default LoginState;