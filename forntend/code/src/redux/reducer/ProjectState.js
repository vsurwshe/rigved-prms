const initialState = {
    projectList: [],
    projectDetails: [],
    projectListByClient:[]
}

const ProjectState = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_PROJECT_LIST":
            return { ...state, projectList: action.projectList }
        case "SAVE_PROJECT_LIST_BY_CLIENT":
            return { ...state, projectListByClient: action.projectList }
        case "SAVE_PROJECT_DATA":
            return { ...state, projectDetails: action.projectData }
        case "DELETE_PROJECT_DATA":
            return { ...state, projectDetails: action.projectData }
        default:
            return state;
    }
}

export default ProjectState;