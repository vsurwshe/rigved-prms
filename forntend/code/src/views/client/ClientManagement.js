import React, { Component } from 'react';
import { Card, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import ClientTable from './ClientTable';
import { connect } from 'react-redux';
import ClientForm from './ClientForm';
import { bindActionCreators } from 'redux';
import * as ClientAction from "../../redux/actions/ClientAction";
import * as MasterDataAction from "../../redux/actions/MasterDataAction";
import * as FileAction from "../../redux/actions/FileAction"
import { API_EXE_TIME } from '../../assets/config/Config';

class ClientManagment extends Component {
    state = {
        createClient: false,
        loadClientList: false,
        clientData: [],
        deleteModel: false,
        operation:"",
        gstFileUrl:"",
        tanFileUrl:"",
        gstUpload:false,
        tanUpload:false
    }

    componentDidMount = async () => {
        const { listOfClient } = this.props.ClientState;
        const { authorization } = this.props.LoginState;
        const { SkillSet,SkillCategory,Domains}=this.props.MasterDataSet
        const { GetClientList,loadMessage } = this.props.ClientAction;
        const { GetSkillSet, GetSkillCategory, GetDomains } = this.props.MasterDataAction;
        await this.handleLoadClientList(true);
        (SkillSet && SkillSet.length === 0) && await GetSkillSet(0, 10, authorization);
        (SkillCategory && SkillCategory.length === 0) && await GetSkillCategory(0, 10, authorization);
        (Domains && Domains.length === 0) &&  await GetDomains(0, 10, authorization);
        (listOfClient && listOfClient.length === 0) && await GetClientList(0, 20, authorization);
        await loadMessage();
        await this.handleLoadClientList(false);
    }

    // this method used for the create client from
    handleCreateClient = (clientData,operation) => { this.setState({ createClient: !this.state.createClient, clientData, operation }) }

    // this method used for the progress bar 
    handleLoadClientList = (loadValue) => { this.setState({ loadClientList: loadValue }) }

    // this method used for the load the delete model
    handleDeleteModel = (clientData) => { this.setState({ deleteModel: !this.state.deleteModel, clientData }) };

    // this method used for the handle the gst uploading
    handleGSTUpload=()=>{this.setState({gstUpload : !this.state.gstUpload})}

    // this method used for the handle the gst uploading
    handleTANUpload=()=>{ this.setState({tanUpload : !this.state.tanUpload})}

    render() {
        const { createClient, clientData } = this.state
        return <Card> {createClient ? this.loadClientForm(clientData) : this.loadClientTable()}</Card>
    }

    uploadGSTFile=async(fileData,name,type)=>{
        const {SaveFileDetails, SaveFileData}= this.props.FileAction
        const { authorization } = this.props.LoginState
        const { loadMessage } = this.props.ClientAction;
        const { dispatch }=this.props
        let newFileData=[{
            "fileName":name,
	        "description":"ClientDetail",
	        "contentType":'png',
	        "content":`${fileData}`
        }]
        await this.handleGSTUpload();
        await SaveFileDetails(newFileData, authorization,fileData)
        setTimeout(async () => {
            await dispatch(loadMessage());
            await SaveFileData();
            await this.handleGSTUpload();
        }, API_EXE_TIME)
        this.setState({gstFileUrl : (this.props.FileState.fileUrl && this.props.FileState.fileUrl.length >0)  && this.props.FileState.fileUrl[0]})
    }

    uploadTANFile=async(fileData,name,type)=>{
        const {SaveFileDetails, SaveFileData}= this.props.FileAction
        const { authorization } = this.props.LoginState
        const { loadMessage} = this.props.ClientAction;
        const { dispatch }=this.props
        let newFileData=[{
            "fileName":name,
	        "description":"ClientDetail",
	        "contentType":'png',
	        "content":`${fileData}`
        }]
        await this.handleTANUpload();
        await SaveFileDetails(newFileData, authorization)
        setTimeout(async () => {
            await dispatch(loadMessage());
            await SaveFileData();
            await this.handleTANUpload();
        }, API_EXE_TIME)
        this.setState({tanFileUrl : (this.props.FileState.fileUrl && this.props.FileState.fileUrl.length >0)  && this.props.FileState.fileUrl[0]})
    }

    clearFileUrl=()=>{ this.setState({gstFileUrl:"",tanFileUrl:""}) }

    // this method used for the loading client form
    loadClientForm = (clientData) => {
        const {operation, gstFileUrl, tanFileUrl,gstUpload,tanUpload}=this.state
        let newClientData = undefined;
        if (clientData) {
            newClientData = {
                ...clientData,
                "addressDtos": clientData.addressDtos && clientData.addressDtos[0],
                "bankDetailsDtoList": clientData.bankDetailsDtoList && clientData.bankDetailsDtoList[0]
            }
        }
        const data={ gstFileUrl,  tanFileUrl, operation, gstUpload, tanUpload }
        return <ClientForm stateData={data} initialValues={newClientData} SaveClientMethod={this.SaveClientDetails} gstFileUpload={this.uploadGSTFile} tanFileUpload={this.uploadTANFile} cancle={this.handleCreateClient} clearFile={this.clearFileUrl} />
    }

    loadDeleteModel = () => {
        const { deleteModel, clientData } = this.state
        const { id, clientName } = clientData  ? clientData : ''
        return <Dialog open={deleteModel} keepMounted onClose={this.handleDeleteModel} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description"   >
            <DialogTitle id="alert-dialog-slide-title">{'Delete Client Data'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {"You are deleteing " + clientName + " client record. Are you sure want to delete this record ?"}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleDeleteModel} color="primary">Cancel</Button>
                <Button onClick={() => this.DeleteClientDetails(id)} color="secondary">Delete</Button>
            </DialogActions>
        </Dialog>
    }

    // this method main framework which calling load client table method
    loadClientTable = () => {
        const { loadClientList } = this.state
        return < div style={{ paddingRight: 10 }}> {loadClientList ? this.loadingCircle() : this.loadingClientTable()} </div>
    }

    // this method used for load the client table
    loadingClientTable = () => {
        const {operation}=this.state
        return <> {this.loadDeleteModel()}
            <ClientTable  operation={operation} createClient={this.handleCreateClient} viewClientDetails={this.viewClientDetails}  deleteClientDetails={this.handleDeleteModel}  />
        </>
    }
    // this method used for the show circular progress bar 
    loadingCircle = () => <center> <h3>Client Managment</h3> <CircularProgress size={80} /> </center>

    // this method called when we click the view button in client table
    viewClientDetails = (data,operation) => {  this.handleCreateClient(data,operation)  }

    // this method used for the save the client details
    SaveClientDetails = async (propsData) => {
        const { SaveClientData, loadMessage, GetClientList } = this.props.ClientAction;
        const { authorization } = this.props.LoginState
        const { clientDetails } = this.props.ClientState
        const { gstFileUrl, tanFileUrl} =this.state
        const { values,rateCardDtos }=propsData
        const { dispatch }=this.props
        const newUserData = {
            ...values,
            "gstUrl": (gstFileUrl === "" || gstFileUrl === undefined) ? values.gstUrl  :gstFileUrl,
            "tanUrl": (tanFileUrl === "" || tanFileUrl === undefined) ? values.tanUrl : tanFileUrl,
            "addressDtos": values.addressDtos ? [values.addressDtos] : null,
            rateCardDtos,
            "active": true,
            "bankDetailsDtoList": values.bankDetailsDtoList ? [values.bankDetailsDtoList] : null
        }
        await SaveClientData(newUserData, authorization)
        setTimeout(async () => {
            await dispatch(loadMessage());
            await GetClientList(0, 20, authorization);
            await this.setState({tanFileUrl : "", gstFileUrl:""})
            clientDetails.Status === "OK" && await alert("Your client details are saved");
            this.handleCreateClient();
        }, API_EXE_TIME)
    }

    DeleteClientDetails = async (clientId) => {
        const { DeleteClient, loadMessage, GetClientList } = this.props.ClientAction;
        const { authorization } = this.props.LoginState
        const { dispatch }=this.props
        await this.handleLoadClientList(true);
        clientId && await DeleteClient(clientId, authorization);
        setTimeout(async () => {
            await dispatch(loadMessage());
            await GetClientList(0, 20, authorization);
            await this.handleDeleteModel();
            await this.handleLoadClientList(false);
        }, API_EXE_TIME)
    }
}

const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    ClientAction: bindActionCreators(ClientAction, dispatch),
    FileAction: bindActionCreators(FileAction, dispatch),
    MasterDataAction: bindActionCreators(MasterDataAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientManagment);