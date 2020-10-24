import {AlertColor} from '../../assets/config/Config';
import {CONFLICTSTATUS, STATUS200, UNAUTHORIZEDSTATUS } from "../../assets/config/CodeMap";
import {setAuthrizations} from "./LoginAction"

const SuccessFunction=(props)=>{
    const { dispatch, successMethod, loadMessage, response, postMethod, id,check, message}=props
    if(response && response.status !== STATUS200 && !check){
        dispatch(loadMessage(AlertColor.danger , response.headers.message));
    }else{
        response.headers.message && postMethod && dispatch(loadMessage(AlertColor.success , response.headers.message));
        id ? dispatch(successMethod(response.data,id)) : dispatch(successMethod(response.data))
        postMethod && dispatch(loadMessage("" , ""));
        dispatch(loadMessage(AlertColor.success , message));
    }
}

const ErrorFunction=(props)=>{
    const { dispatch, loadMessage, error }=props
    if (error && error.response && error.response.status.toString() === UNAUTHORIZEDSTATUS) {
        dispatch(setAuthrizations());
    }else if(error && error.response && error.response.status.toString() === CONFLICTSTATUS){
        dispatch(loadMessage(AlertColor.danger, error.response.headers.message));
    }else{
        dispatch(loadMessage(AlertColor.danger, 'Something went worng..!'));
    }
}

export {
    SuccessFunction,
    ErrorFunction
}