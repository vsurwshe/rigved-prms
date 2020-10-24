import { API_URL } from './Config';
import Axios from 'axios';



const HeaderConfig=(authroizationKey,userData)=>{
    if(userData){
        return{
            headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }
        }    
    }
    return{
        data:{},
        headers: { 
            'Content-Type': 'application/json',
            Authorization: authroizationKey 
        }
    }
}

const CreateInstance=()=> {
    let instance = Axios.create({
      baseURL: API_URL,
    });
    return instance;
}


export {
    CreateInstance,
    HeaderConfig
}