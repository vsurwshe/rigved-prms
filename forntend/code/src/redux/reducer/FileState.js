const initialState = {
    listOfFiles: [],
    fileUrl: ""
}

const FileState = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_FILE_DATA":
            return { ...state, fileUrl: action.fileData }
        case "SAVE_FILES":
            return {...state, listOfFiles:[action.payload,...state.listOfFiles] }
        default:
            return state;
    }

}

export default FileState;