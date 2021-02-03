import React,{ useState} from 'react';
import { reduxForm, Field, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import { Button, Grid} from '@material-ui/core';
import useStyles from "../client/Styles";
import { renderTextField, renderDateTimePicker, renderAutocompleteWithProps, renderFileInput, renderAutocomplete, renderNumberField, renderTextAreaField, renderTextHiddenField, renderLoading, renderSanckbarAlert } from '../utilites/FromUtilites';
import { Required } from '../utilites/FormValidation';
import { FromActions } from '../../assets/config/Config';
import SimpleTabs from '../client/TabPanleUtilites';
import * as FileAction from '../../redux/actions/FileAction'
import * as PurchaseOrderAction from '../../redux/actions/PurchaseOrderAction';
import * as BillingModelAction from '../../redux/actions/BillingModelAction';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { loadMessage } from "../../redux/actions/ClientAction"
import { structureOptions, LoadBillingModelTab, LoadResourcesTab, LoadExpensesTab } from './ProjectFormUtilites';

// this will help to load project form component
let ProjectForm = (props) => {
    var classes = useStyles();
    const { SaveMethod, pristine, reset, submitting, handleSubmit, cancle, clearFile } = props
    const { operation } = props.stateData
    const [projectLoad, setProjectLoad] = useState(false);
    return <div className={classes.girdContainer}>
        <form onSubmit={handleSubmit(values => SaveMethod({values, setProjectLoad}))}>
            {LoadGird({props ,projectLoad})}
            <div className={classes.buttonStyle}>
                <center>
                    {(operation === FromActions.CR || operation === FromActions.ED) && <>
                    <Button type="submit" variant="outlined" color="primary" disabled={pristine || submitting}> SUBMIT </Button> &nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" disabled={pristine || submitting} onClick={reset}> Clear Values</Button></>}&nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" onClick={async () => { await clearFile(); await reset(); cancle() }}> Cancel</Button>
                </center>
            </div>
        </form>
    </div>
}

// this method will used for the gird structure of this component
const LoadGird = (propsData) => {
    var classes = useStyles();
    const { props, projectLoad }=propsData
    const {color, common_message}=props.ClientState
    const { initialValues, dispatch } = props
    return <><Grid container spacing={5}>
        {(common_message && common_message !== "Something went worng..!")&& showMessage({common_message, color, dispatch})}
        </Grid>
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6} style={{ paddingLeft: 30, paddingTop: 20 }}>
                {SectionOne({ classes, props, initialValues })}
            </Grid>
            <Grid item xs={12} sm={6} style={{ paddingTop: 50 }}>
                {SectionTwo({ classes, props, initialValues })}
            </Grid>
        </Grid>
        {projectLoad && renderLoading({message:"Saving....", size:40 })}
        <Grid container spacing={5} style={{ paddingLeft: 10, paddingTop: 20 }}>
            <Grid item xs={12}>
                {SectionThree({ classes, "mainProps": props })}
            </Grid>
        </Grid>
    </>
}

// this method will help to show sanckbar
const showMessage=(props)=>{
    const { common_message, color, dispatch }=props
    return <>
    <center>
        {renderSanckbarAlert({message:common_message, color:color})}
    </center>
    {setTimeout(async()=>{ await dispatch(loadMessage()); },1000)}
    </>
}

// this method will used for the load the left side part 
const SectionOne = (data) => {
    const { classes, initialValues } = data
    const { operation } = data.props.stateData
    return <> {(operation === FromActions.CR || operation === FromActions.VIED ) ? LoadFields({ classes, "mainProps": data.props }) : LoadHeader({ classes, initialValues, "mainProps": data.props })}</>
}

// this method will used for showing fileds as per operations
const LoadFields = (parameter) => {
    const { change } = parameter.mainProps
    const { authorization }=parameter.mainProps.LoginState
    const { listOfClient } = parameter.mainProps.ClientState
    const { ManagerList, Domains, projectBillingModelList } = parameter.mainProps.MasterDataSet
    const { purchaseOrderListByName } = parameter.mainProps.PurchaseOrderState
    const { GetPurchaseOrderListByName }=parameter.mainProps.PurchaseOrderAction
    let projectManagerOptions=structureOptions({options:ManagerList,keys: ['firstName','lastName'],idKey:'accountId'});
    let clientOptions= structureOptions({options:listOfClient,keys: ['clientName'],idKey:'id'});
    let purchaseOrderOptions= structureOptions({options :purchaseOrderListByName,keys: ['poNum'],idKey:'id'});
    let projectTypeOptions= structureOptions({options:Domains,keys: ['name'], idKey:'id'})
    let projectBillingTypes=structureOptions({options:projectBillingModelList,keys: ['name'], idKey:'id'})
    return <>
        <Field name="projectName" component={renderTextField} fullWidth label="Project Name" helperText="Ex. PRMS" />
        <Field name="projectType" component={renderAutocomplete} optionData={projectTypeOptions} label="Project Type" validate={[Required]} />
        <Field name="projectBillingType" component={renderAutocomplete} optionData={projectBillingTypes} label="Project Billing Type" validate={[Required]} />
        <Field name="clientName" component={renderAutocompleteWithProps} onChange={(value) => clientChange({value,change,GetPurchaseOrderListByName,authorization})}
            optionData={clientOptions} label="Client Name" validate={[Required]} />
        <Field name="clientId" component={renderTextHiddenField} />
        <Field name="projectManager" component={renderAutocomplete} optionData={projectManagerOptions} label="Project Manager Name" validate={[Required]} />
        <Field name="purchaseOrder" component={renderAutocompleteWithProps} onChange={(value) => purchaseOrderChange({value,change})}
            optionData={purchaseOrderOptions} label="Purchase Order Number (Current)" />
    </>
}

// this method will used for purchase order change
const clientChange=async (dataProps)=>{
    const { value, change, GetPurchaseOrderListByName,authorization}=dataProps
    await change('ProjectForm', 'clientId', value.id);
    await change('ProjectForm', 'clientName', value.title);
    await GetPurchaseOrderListByName(0,20,value.id,authorization)
}

// this method will used for purchase order change
const purchaseOrderChange=async(dataProps)=>{
    const { value, change}=dataProps
    await change('ProjectForm', 'purchaseOrder', value.title);
    await change('ProjectForm', 'purchaseOrderId', value.id);   
}

// this method will used for the showing header information as per oprations
const LoadHeader = (parameter) => {
    const { initialValues } = parameter
    const { purchaseOrderList } = parameter.mainProps.PurchaseOrderState
    let purchaseOrderDetails = (purchaseOrderList && purchaseOrderList.length > 0) && purchaseOrderList.filter(item => item.poNum === initialValues.purchaseOrder)
    return <>
        <h2>{initialValues.projectName}</h2>
        <h4>Client Name: {initialValues.clientName}</h4>
        <h4>Project Manager: {initialValues.projectManager}</h4>
        <h4>Project Billing type: {initialValues.projectBillingType}</h4>
        <h4>Purchase Order: {initialValues.purchaseOrder}&nbsp;&nbsp;&nbsp;
        <Button component={Link} to={{ pathname: '/purchaseOrder', purchaseOrderDetails }} color="secondary" variant="contained">View PO</Button>
        </h4>
    </>
}

// this method will used for the right side part of this component
const SectionTwo = (data) => {
    const { classes, initialValues } = data
    const { uploadFile } = data.props
    const { operation, projectContractFileUrl, projectContractFileUpload } = data.props.stateData
    return <>
        <Field name="projectStartDate" component={renderDateTimePicker} className={classes.textField} label="Start Date" helperText={(initialValues === undefined) && "Ex. 01/01/2000"} disabled={operation === FromActions.VI}  />
        <Field name="projectEndDate" component={renderDateTimePicker} className={classes.textField} label="End Date" helperText={(initialValues === undefined) && "Ex. 01/01/2000"} disabled={operation === FromActions.VI} />
        <Field name="projectCost" component={renderNumberField} className={classes.textField} label="Project Cost" helperText={(initialValues === undefined) && "Ex. 20000"} disabled={operation === FromActions.VI} validate={[Required]} />
        <Field name="projectDesc" component={renderTextAreaField} fullWidth maxRows={2} label="Project Description" disabled={operation === FromActions.VI} />
        {operation === FromActions.CR &&
            <>{(projectContractFileUpload) ? renderLoading({message:"Uploading", size:40})
                : (projectContractFileUrl ? LoadFileUrl({ "url": projectContractFileUrl, "cid": 1, "mainProps": data, "componentName": "Purchase Order Image", "style": { height: "60%", width: "100%" } })
                    : <Field name="contractAttachmentUrl" component={renderFileInput} fullWidth type="file" successFunction={uploadFile} lable="Project File" />)
            }</>
        }
    </>
}

// this method used for the showing image
let LoadFileUrl = (parameter) => {
    const { listOfFiles } = parameter.mainProps.props.FileState
    const exitsData = (listOfFiles.length > 0) && listOfFiles.filter(x => (x.cid === parameter.cid && x.fileName === parameter.url));
    if (exitsData === false || exitsData.length <= 0) { GetPhotos(parameter) }
    return <iframe title="ProjectContractFileUrl" type="application/pdf" src={exitsData.length > 0 && exitsData[0].fileData} style={parameter.style} />
}

// this method used for the load the image form api
const GetPhotos = async (parameter) => {
    const { FetchPhoto } = parameter.mainProps.props.FileAction
    const { authorization } = parameter.mainProps.props.LoginState
    return await FetchPhoto(parameter.url, authorization, parameter.cid, "application/pdf");
}

// this method will used for the loading tabs into project from
const SectionThree = (data) => {
    const { showTabs } = data.mainProps.stateData
    let tabsData = showTabs && [
        { label: "Billing Model", component: <LoadBillingModelTab props={data} /> },
        { label: "Resources", component: <LoadResourcesTab props={data} />},
        { label: "Expenses", component: <LoadExpensesTab props={data} />}
    ]
    return showTabs && <SimpleTabs tabData={tabsData} />
}

// this will help to validate project form
const validate=(values)=>{
    const errors={}
    // this condtions check the project name
    if(!values.projectName) {
        errors.projectName = 'Project Name is Required'
    }
    // this condtions check whtere start date and end date
    if((values.projectEndDate && values.projectStartDate)&&(!values.projectEndDate || !values.projectStartDate)){
        errors.projectStartDate="Project start date is required";
        errors.projectEndDate="Project end date is required";
    }else{
        var startDate = new Date(values.projectStartDate);
        var endDate = new Date(values.projectEndDate);
        if(startDate > endDate){
            errors.projectStartDate="Project start date should be less than end date";
            errors.projectEndDate="Project end date should be grater than start date";
        }
    }
    return errors;
}

// make the selector 
const selector = formValueSelector('ProjectForm')
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    BillingModelAction:bindActionCreators(BillingModelAction,dispatch),
    FileAction: bindActionCreators(FileAction, dispatch),
    PurchaseOrderAction: bindActionCreators(PurchaseOrderAction,dispatch),
    change: bindActionCreators(change, dispatch)
})
ProjectForm = connect(state => {
    // can select values individually
    const purchaseOrder = selector(state, 'purchaseOrder')
    return { ...state, purchaseOrder }
}, mapDispatchToProps)(ProjectForm)
export default reduxForm({ form: 'ProjectForm', validate })(ProjectForm);