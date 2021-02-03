import React, {Component} from 'react';
import ProjectTable from "./ProjectTable";
import ProjectForm from "./ProjectFrom";
import {Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import * as ProjectAction from "../../redux/actions/ProjectAction"
import * as MasterDataAction from "../../redux/actions/MasterDataAction"
import * as ClientAction from "../../redux/actions/ClientAction"
import * as PurchaseOrderAction from "../../redux/actions/PurchaseOrderAction"
import * as FileAction from "../../redux/actions/FileAction"
import { loadMessage } from "../../redux/actions/ClientAction"
import { bindActionCreators } from 'redux';
import { API_EXE_TIME } from '../../assets/config/Config';
import { connect } from 'react-redux';
import moment from 'moment';
import { FromActions } from '../../assets/config/Config';
import { renderLoading } from '../utilites/FromUtilites';

class ProjectManagement extends Component {
    state = { 
        fromAction:false,
        loadProjectList: false,
        showTabs:false,
        projectData: [],
        deleteModel: false,
        operation:"",
        projectContractFileUpload:false,
        projectContractFileUrl:""
     }
    
    componentDidMount=async()=>{
        const { dispatch }=this.props
        const { listOfClient } = this.props.ClientState;
        const { projectList }= this.props.ProjectState
        const { authorization }= this.props.LoginState
        const { purchaseOrderList }= this.props.PurchaseOrderState
        const { Domains, ManagerList, ExpenseTypeList, EmployeeList, SkillCategory, SkillSet, projectBillingModelList } = this.props.MasterDataSet;
        const { GetDomains, GetManagerList, GetExpenseTypeList, GetEmployeeList, GetSkillSet, GetSkillCategory, GetProjectBillingTypeList } = this.props.MasterDataAction;
        const { GetProjectList }= this.props.ProjectAction
        const { GetClientList } = this.props.ClientAction;
        const { GetPurchaseOrderList }= this.props.PurchaseOrderAction
        await this.handleLoadProjectList();
        (Domains && Domains.length === 0) && await GetDomains(0, 10, authorization);
        (SkillCategory && SkillCategory.length ===0) && GetSkillCategory(0,10,authorization);
        (SkillSet && SkillSet.length ===0) && GetSkillSet(0,10,authorization);
        (ManagerList && ManagerList.length === 0) && await GetManagerList(0,10,authorization);
        (ExpenseTypeList && ExpenseTypeList.length === 0) && await GetExpenseTypeList(0,20,authorization);
        (EmployeeList && EmployeeList.length === 0) && await GetEmployeeList(0,100,authorization);
        (listOfClient && listOfClient.length === 0) && await GetClientList(0,20,authorization);
        (projectBillingModelList && projectBillingModelList.length === 0) && await GetProjectBillingTypeList(0,20,authorization);
        (purchaseOrderList && purchaseOrderList.length === 0) && await GetPurchaseOrderList(0,20,authorization);
        (projectList && projectList.length === 0) && await GetProjectList(0,20,authorization);
        await dispatch(loadMessage());
        await this.handleLoadProjectList();
    }

    // this method used for the progress bar 
    handleLoadProjectList = () => { this.setState({ loadProjectList: !this.state.loadProjectList }) }

    // this method used for the from actions in project 
    handleProjectFromActions = (projectData,operation,showTabsOps) => { this.setState({ fromAction: !this.state.fromAction, projectData, operation, showTabs: showTabsOps ? true: false  }) }

    // this method used for the load the delete model
    handleDeleteModel = (projectData) => { this.setState({ deleteModel: !this.state.deleteModel, projectData }) };

    // this method used for the handling the puchase order file
    handleProjectContractFileUplaod=()=>{ this.setState({projectContractFileUpload : !this.state.projectContractFileUpload})}

    // this method used for the after saving project record showing the tabs
    handleShowTabs=(operation)=>{this.setState({ showTabs : !this.state.showTabs, operation})}

    render() { 
        const {fromAction, projectData}=this.state
        return <Card> {fromAction ? this.loadProjectForm(projectData) :this.loadProjectTable()}</Card>
    }

    uploadContractFile=async(fileData,name,type)=>{
        const {SaveFileDetails, SaveFileData}= this.props.FileAction
        const { authorization } = this.props.LoginState
        let newFileData=[{
            "fileName":name,
	        "description":"ProjectDetail",
	        "contentType":"pdf",
	        "content":`${fileData}`
        }]
        await this.handleProjectContractFileUplaod();
        await SaveFileDetails(newFileData, authorization)
        setTimeout(async () => {
            await loadMessage()
            await SaveFileData();
            await this.handleProjectContractFileUplaod();
        }, API_EXE_TIME)
        this.setState({projectContractFileUrl : (this.props.FileState.fileUrl && this.props.FileState.fileUrl.length >0)  && this.props.FileState.fileUrl[0]})
    }

    // this method used for the loading Project form
    loadProjectForm = (projectData) => {
        const {operation,projectContractFileUrl, projectContractFileUpload, showTabs}=this.state
        let newProjectData = undefined;
        if (projectData) {
            newProjectData = {
                ...projectData,
                "projectStartDate":moment(projectData.projectStartDate).format('YYYY-MM-DD') ,
                "projectEndDate":moment(projectData.projectEndDate).format('YYYY-MM-DD') ,
            }
        }
        const data={ operation,projectContractFileUrl, projectContractFileUpload, showTabs }
        return <ProjectForm 
                stateData={data} 
                initialValues={newProjectData} 
                SaveMethod={this.SaveProject} 
                cancle={this.handleProjectFromActions} 
                uploadFile={this.uploadContractFile}
                tabControl={this.handleShowTabs}
                clearFile={this.clearFileUrl}
            />
    }
    // this method used for the clear the state variable
    clearFileUrl=()=>{ this.setState({projectContractFileUrl:""}) }

    // this method main framework which calling load PurchaseOrder table method
    loadProjectTable = () => {
        const { loadProjectList } = this.state
        return < div style={{ paddingRight: 10 }}>  {loadProjectList ? renderLoading({message:"Project Management", size:80}):this.loadingProjectTable()} </div>
    }

    // this method used for load the client table
    loadingProjectTable = () => {
        const {operation}=this.state
        return <>
        {this.loadDeleteModel()}
        <ProjectTable  
            operation={operation} 
            deleteMethod={this.handleDeleteModel}
            fromAction={this.handleProjectFromActions}
        />
    </>
    }

    // this method will used for the delete project model
    loadDeleteModel = () => {
        const { deleteModel, projectData } = this.state
        const { id, projectName } = projectData  ? projectData : ''
        return <Dialog open={deleteModel} keepMounted onClose={this.handleDeleteModel} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description"   >
            <DialogTitle id="alert-dialog-slide-title">{'Delete Project Record'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {"You are deleteing " + projectName + " project record. Are you sure want to delete this record ?"}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleDeleteModel} color="primary">Cancel</Button>
                <Button onClick={() => this.DeleteProject(id)} color="secondary">Delete</Button>
            </DialogActions>
        </Dialog>
    }

    // this method used for the call the save project api
    SaveProject=async(propsData)=>{
        const { values, setProjectLoad }=propsData
        const { projectContractFileUrl }=this.state
        const { dispatch }=this.props
        const { SaveProjectRecord, GetProjectList } = this.props.ProjectAction;
        const { authorization } = this.props.LoginState
        const newProjectData = {
            ...values,
            "purchaseOrder":values.purchaseOrder && values.purchaseOrder.title,
            "contractAttachmentUrl":(projectContractFileUrl === "" || projectContractFileUrl === undefined) ? values.contractAttachmentUrl  : projectContractFileUrl,
            "active": true,
        }
        await setProjectLoad(true);
        await SaveProjectRecord(newProjectData, authorization)
        setTimeout(async () => {
            await dispatch(loadMessage());
            await GetProjectList(0, 20, authorization);
            await setProjectLoad(false);
            this.handleShowTabs(FromActions.VIED);
        }, API_EXE_TIME)
    }

    DeleteProject = async (projectId) => {
        const { GetProjectList,DeleteProjectRecord }= this.props.ProjectAction
        const { authorization } = this.props.LoginState
        await this.handleLoadProjectList();
        projectId && await DeleteProjectRecord(projectId, authorization);
        setTimeout(async () => {
            await loadMessage();
            await GetProjectList(0, 20, authorization);
            await this.handleDeleteModel();
            await this.handleLoadProjectList();
        }, API_EXE_TIME)
    }
}

const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    ProjectAction: bindActionCreators(ProjectAction, dispatch),
    MasterDataAction: bindActionCreators(MasterDataAction, dispatch),
    ClientAction: bindActionCreators(ClientAction, dispatch),
    PurchaseOrderAction: bindActionCreators(PurchaseOrderAction, dispatch),
    FileAction : bindActionCreators(FileAction,dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(ProjectManagement);