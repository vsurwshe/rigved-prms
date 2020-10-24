import { API_URL } from '../../assets/config/Config';
import { CreateInstance } from '../../assets/config/APIConfig';
import { loadMessage } from "../actions/ClientAction";
import { SuccessFunction, ErrorFunction } from "./CommonAction"

const SaveFileDetails = (fileData, authroizationKey) => {
    return (dispatch) => {
        return CreateInstance()
            .post('/file/upload/', fileData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authroizationKey
                }
            })
            .then(response => { SuccessFunction({ dispatch , "successMethod": SaveFileData, "loadMessage":loadMessage, response, message:response.data[0]}) })
            .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    }
}

const DownloadExcel = (authroizationKey) => {
    return (dispatch) => {
       return CreateInstance()
        .get('/file/getRegXl',{ headers: { 
                'Content-Type': 'application/json',
                Authorization: authroizationKey 
            }})
        .then((response)=>{
            let file = base64toBlob(response.data.content);
            if(file){
                const url = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = url;
                link.innerText = 'Open the array URL';
                link.setAttribute('download', 'RigvedTechBulkEmployeeExcel.xlsx');
                link.click();
            }
        })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    } 
}

// this function is convert base64 to blob with elsx file format
function base64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }    
    var blob = new Blob(byteArrays, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    return blob;
}

const FetchPhoto = (fileUrl,authroizationKey,clientId,fileType) => {
    return (dispatch) => {
        return fetch(API_URL+'/file/getFile/'+fileUrl, {
            headers: {
                "content-type": "application/json",
                Authorization: authroizationKey
            }
        })
        .then((response) => {return response.blob();})
        .then((myBlob) => {
                const file = fileType && new Blob([myBlob], {type: 'application/pdf'});
                let ImageUrl= fileType ? URL.createObjectURL(file) :  URL.createObjectURL(myBlob)
                dispatch(SaveFile(ImageUrl,fileUrl,clientId))
        })
        .catch(error => { ErrorFunction({dispatch,"loadMessage":loadMessage, error}) })
    } 
}
//-----------------------------------

export function SaveFileData(fileData) {
    return {
        type: "SAVE_FILE_DATA",
        fileData
    }
}

export function SaveFile(fileData, fileName,clientId) {
    return {
        type: "SAVE_FILES",
        payload : {"fileData":fileData, "fileName" :fileName, "cid" :clientId}
    }
}

export {
    SaveFileDetails,
    FetchPhoto,
    DownloadExcel
}