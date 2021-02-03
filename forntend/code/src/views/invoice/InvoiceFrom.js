import React, { useState, forwardRef } from 'react';
import { reduxForm, change, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Slide, AppBar, Toolbar, IconButton } from '@material-ui/core';
import useStyles from "../client/Styles";
import { renderDateTimePicker, renderAutocompleteWithProps, renderLoading, renderTextHiddenField, renderSanckbarAlert, dwonloadInvoice } from '../utilites/FromUtilites';
import { Required } from '../utilites/FormValidation';
import * as ClientAction from "../../redux/actions/ClientAction";
import * as ProjectAction from "../../redux/actions/ProjectAction"
import * as InvoiceAction from "../../redux/actions/InvoiceAction"
import * as PurchaseOrderAction from "../../redux/actions/PurchaseOrderAction"
import Invoice from './Invoice';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import { API_EXE_TIME, ProjectBillingModelType } from '../../assets/config/Config';
import { structureOptions } from '../project/ProjectFormUtilites';
import { ClientBillingPreInvoiceTable, FixedCostPreInvoiceTable, MileStonePreInvoiceTable, PayableDaysPreInvoiceTable } from './InvoiceFromUtilites';

// this method will used for the transition for model 
const Transition = forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} />; });

// this method will load the invoice form
let InvoiceFrom = (props) => {
    var classes = useStyles();
    const { pristine, reset, submitting, handleSubmit, cancle, initialValues } = props
    const { SaveInvoiceEmployeeData } = props.InvoiceAction
    const [viewInvoice, setViewInvoice] = useState(false);
    const [projectIdList, setProjectIdList] = useState([])
    const [sectionThreeState, setSectionThreeState] = useState({view:false,projectType:''})
    const [loading, setLoading] = useState(false)
    const [submit, setSubmit] = useState(false)
    return <div className={classes.girdContainer}>
        <form onSubmit={handleSubmit((values) => PostInvoiceData({ "mainProps": props, values, projectIdList, setSubmit, sectionThreeState, setLoading, setSectionThreeState }))}>
            {   LoadGird ({
                    mainProps:props,// this is main props
                    setSectionThreeState, // this will used for setting 3rd section
                    sectionThreeState, // this will used for showing 3rd section
                    loading, // this varible used for loading
                    setLoading, //this method used for setting load operator
                    setViewInvoice, // this method will used for view invoice
                    setSubmit, // this method will used setting submit methos
                    projectIdList, // this variabel will used for projectIdList variable
                    setProjectIdList // this method will used for setting projectIds List
                })
            }
            {<ShowViewInvoice 
                mainProps={props} // this is main props
                classes={classes} // this is style classes 
                viewInvoice={viewInvoice} // this is viewinvoice variable
                setViewInvoice={setViewInvoice} // this mos method will used for setting viewinvoice variable
                reset={reset} // this will used reseting form
                cancle={cancle} // this will used cancleing form
            />}
            <div className={classes.buttonStyle}>
                <center>
                    {!initialValues && <><Button type="submit" variant="outlined" color="primary" disabled={pristine || submitting || submit}>SUBMIT</Button> &nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" disabled={pristine || submitting} onClick={async () => { await reset(); await SaveInvoiceEmployeeData([]); await setSectionThreeState({view:false, projectType:""}); }}> Clear Values</Button>&nbsp;&nbsp;</>}
                    <Button type="button" variant="outlined" color="secondary" onClick={async () => { await reset(); cancle() }}> Cancel</Button> &nbsp;&nbsp;
                </center>
            </div>
        </form>
    </div>
}

// this method will used for the loading gird structure of invoice form component
const LoadGird = (props) => {
    var classes = useStyles();
    const { projectIdList, setProjectIdList, setSectionThreeState, sectionThreeState, loading, setLoading, setViewInvoice, setSubmit } = props
    const { color, common_message } = props.mainProps.ClientState
    const { initialValues }=props.mainProps
    return <>
        <Grid container spacing={5}>
            <Grid item xs={12} style={{ padding: 30 }}>
                {(common_message) &&  renderSanckbarAlert({message:common_message,color})}
            </Grid>
        </Grid>
        <Grid container spacing={5}>
            { initialValues ? <LoadHeader initialValues={initialValues} mainProps={props.mainProps} setLoading={setLoading}/>:
                <>
                <Grid item xs={12} sm={6} style={{ paddingLeft: 30, paddingTop: 30 }}>
                    {SectionOne({ classes, "mainProps": props.mainProps, projectIdList, setProjectIdList, setLoading })}
                </Grid>
                <Grid item xs={12} sm={6} style={{ paddingLeft: 30, paddingTop: 30 }} >
                    {SectionTwo({ classes, "mainProps": props.mainProps })}
                </Grid>
            </>}
        </Grid>
        <center>{loading && renderLoading({message:"", size:40})}</center>
        <Grid container spacing={5} style={{ paddingLeft: 10, paddingTop: 20 }}>
            <Grid item xs={12}>
                {sectionThreeState.view && SectionThree({ "mainProps": props.mainProps ,setSectionThreeState, sectionThreeState, setLoading, setViewInvoice, setSubmit})}
            </Grid>
        </Grid>
    </>
}

// this component will help to view Invoice Display
const LoadHeader=(props)=>{
    const { initialValues, mainProps, setLoading }=props
    const { invoiceUserList}=mainProps.InvoiceState
    return <>
        <Grid item xs={12} sm={6} style={{ paddingLeft: 20 }}> 
            <h4>Client Name : {initialValues.toCompanyName}</h4>
            <h4>Date : {initialValues.invoiceDate}</h4>
            <h4>Client Project Billing Type : {initialValues.billingType}</h4>
            <h4>Total Amount : {initialValues.billWitoutGST}</h4>
            <h4>Total Amount with Tax : {initialValues.billWitGST}</h4>
        </Grid>
        <Grid item xs={12}>
           {showProjectTypeAccordingTabel({projectBillingModel: initialValues.billingType, mainProps, setLoading, invoiceUserList})}
        </Grid>
    </>
}

// this method will help to load according to project type Table
const showProjectTypeAccordingTabel=(propsData)=>{
    const { projectBillingModel, mainProps, setLoading, invoiceUserList }=propsData
    switch (projectBillingModel) {
        case ProjectBillingModelType.MILE_STONE:
            return <MileStonePreInvoiceTable 
                setLoading={setLoading} 
                props={mainProps} 
                projectType={projectBillingModel} 
                tableData={invoiceUserList}
            />
        case ProjectBillingModelType.FIXED_TYPE:
            return <FixedCostPreInvoiceTable 
                setLoading={setLoading} 
                props={mainProps} 
                projectType={projectBillingModel}
                tableData={invoiceUserList}
            />
        case ProjectBillingModelType.PAYABLES_DAY:
            return <PayableDaysPreInvoiceTable 
                setLoading={setLoading} 
                props={mainProps} 
                projectType={projectBillingModel}
                tableData={invoiceUserList}
            />
        case ProjectBillingModelType.CLIENT_BILLING:
            return <ClientBillingPreInvoiceTable 
                setLoading={setLoading} 
                props={mainProps} 
                projectType={projectBillingModel}
                tableData={invoiceUserList}
            />
        default:
            return <h2>No Invoice Content</h2>
    }
}


// this method will used for the load the left side part 
const SectionOne = (data) => {
    const { setProjectIdList } = data
    const { setLoading }= data
    const { listOfClient } = data.mainProps.ClientState
    const { authorization } = data.mainProps.LoginState
    const { projectListByClient } = data.mainProps.ProjectState
    const { GetProjectListByClient } = data.mainProps.ProjectAction
    // this is returning client option 
    let clientOptions = structureOptions({options:listOfClient,keys: ['clientName'],idKey:'id'}); 
    // this is returning project option
    let projectOptions = structureOptions({options:projectListByClient,keys: ['projectName'],idKey:'id'}); 
    return <>
        <Field name="projectType" component={renderTextHiddenField} type="hidden" />
        <Field name="clientName" component={renderAutocompleteWithProps} onChange={(value) => onChangeClientName({setLoading, change, GetProjectListByClient, value, authorization})} optionData={clientOptions} label="Select Client Name" validate={[Required]}  style={{marginTop:-35}} />
        <Field name="projectList" component={renderAutocompleteWithProps} onChange={(value) => onChangeProject({setProjectIdList, change, value, projectListByClient})} optionData={projectOptions} label="Select Client Project" validate={[Required]}  style={{marginTop:-15}} />
    </>
}

// this method will help to on change of client name
const onChangeClientName=async(props)=>{
    const { setLoading, change, GetProjectListByClient,value, authorization}=props
    await setLoading(true)
    await change('InvoiceFrom', 'clientName', value.title);
    await GetProjectListByClient(0, 20, value.id, authorization)
    await setLoading(false);
}

// this method will used for on change of project selection
const onChangeProject=async(props)=>{
    const { setProjectIdList,value}=props
    await setProjectIdList(value)
}

// this method will used for the right side part of this component
const SectionTwo = (data) => {
    const { classes } = data
    return <>
        <Field name="fromDate" component={renderDateTimePicker} className={classes.textField} label="From Date" helperText="Ex. 01/01/2000" validate={[Required]} />
        <Field name="toDate" component={renderDateTimePicker} className={classes.textField} label="To Date" helperText="Ex. 01/01/2000" validate={[Required]} />
    </>
}

// this sections will used for the showing structure
const SectionThree = (propsData) => {
    const { sectionThreeState, setLoading, setViewInvoice, mainProps, setSubmit, setSectionThreeState }=propsData
    const { preInvoiceMileStonesData, preInvoiceFixedCostData, preInvoicePayablesData } = mainProps.InvoiceState
    const { projectType }=sectionThreeState
    if(projectType === ProjectBillingModelType.MILE_STONE) {
        if(preInvoiceMileStonesData && preInvoiceMileStonesData.length >0){
            return <MileStonePreInvoiceTable 
                setLoading={setLoading} 
                props={mainProps} 
                setViewInvoice={setViewInvoice}
                projectType={projectType} 
            />
        }else{
            setSubmit(true);
            setSectionThreeState({ view: true, projectType:""})
        }
    }else if(projectType === ProjectBillingModelType.FIXED_TYPE){
        if(preInvoiceFixedCostData && preInvoiceFixedCostData.length >0){
            return <FixedCostPreInvoiceTable 
                setLoading={setLoading} 
                props={mainProps} 
                setViewInvoice={setViewInvoice} 
                projectType={projectType}
            />
        }else{
            setSectionThreeState({ view: true, projectType:""})
            setSubmit(true);
        }
    }else if(projectType === ProjectBillingModelType.PAYABLES_DAY){
        if(preInvoicePayablesData && preInvoicePayablesData.length >0){
            return <PayableDaysPreInvoiceTable
                setLoading={setLoading} 
                props={mainProps} 
                setViewInvoice={setViewInvoice} 
                projectType={projectType}
            />
        }else{
            setSectionThreeState({ view: true, projectType:""})
            setSubmit(true);
        }
    }else if(projectType === ProjectBillingModelType.CLIENT_BILLING){
        return <ClientBillingPreInvoiceTable 
            setLoading={setLoading} 
            props={mainProps} 
            setViewInvoice={setViewInvoice} 
            projectType={projectType}
        />
    }
}

// this method will used for the saving the genrate invoice
const PostInvoiceData = async (propsData) => {
    const { values, setLoading, setSectionThreeState, mainProps,setSubmit } = propsData
    const { dispatch } = mainProps
    const { authorization } = mainProps.LoginState
    const { projectListByClient } = mainProps.ProjectState
    const { GenerateInvoice, saveMileStonePreInvoiceData, saveFixedCostPreInvoiceData, savePayableDaysPreInvoiceData } = mainProps.InvoiceAction
    const { loadMessage } = mainProps.ClientAction
    let filterProject = values.projectList !== {} && projectListByClient.filter(item=> item.id===values.projectList.id)
    let projectTypeData= filterProject.length >0 && filterProject[0].projectBillingType;
    if(projectTypeData === ProjectBillingModelType.CLIENT_BILLING){
        await setSectionThreeState({ view: true, projectType:projectTypeData});
        await setSubmit(true);
    }else{
        let newInvoiceData = {
            "fromDate": (values && values.fromDate) &&  new moment(values.fromDate+" 00:00", "YYYY-MM-DD HH:mm").format('x'),
            "toDate": (values && values.toDate) && new moment(values.toDate+" 00:00","YYYY-MM-DD HH:mm").format('x'),
            "projectId": (values.projectList !== {} ) && values.projectList.id
        }
        await setLoading(true);
        if (projectTypeData === ProjectBillingModelType.MILE_STONE) {
            await dispatch(saveMileStonePreInvoiceData([]));
        } else if(projectTypeData === ProjectBillingModelType.FIXED_TYPE) {
            await dispatch(saveFixedCostPreInvoiceData([]));
        }else if(projectTypeData === ProjectBillingModelType.PAYABLES_DAY) {
            await dispatch(savePayableDaysPreInvoiceData([]));
        }
        // here we call api with project type thats we check filter result
        projectTypeData && await GenerateInvoice(newInvoiceData, authorization,projectTypeData);
        setTimeout(async() => {
            await dispatch(loadMessage());
            await setSectionThreeState({ view: true, projectType:projectTypeData})
            await setLoading(false);
            await setSubmit(true);
        }, API_EXE_TIME)
    }
}


// this method will used for the showing invoice after posting successfully resource table
const ShowViewInvoice = (propsData) => {
    const { viewInvoice, setViewInvoice, classes, reset, cancle, mainProps } = propsData
    const { invoiceEmployeeData }=mainProps.InvoiceState
    if(invoiceEmployeeData && Object.keys(invoiceEmployeeData).length >= 8){
        return <Dialog fullScreen open={viewInvoice} onClose={() => setViewInvoice(false)} TransitionComponent={Transition}>
        <AppBar className={classes.dialogAppBar} style={{ float: "right" }} >
            <Toolbar >
                <IconButton classes={{ paper: classes.profileMenuIcon }} color="inherit" onClick={() => setViewInvoice(false)} aria-label="close"> <CloseIcon /> </IconButton>
                <DialogTitle>Generated Invoice</DialogTitle>
            </Toolbar>
        </AppBar>
        <DialogContent> <Invoice inoiceData={invoiceEmployeeData}/> </DialogContent>
        <DialogActions>
            <Button onClick={async () => {await reset(); await setViewInvoice(false); await cancle()}} color="primary">Cancel</Button>
            <Button onClick={() => dwonloadInvoice()} color="secondary">Download Invoice</Button>
        </DialogActions>
    </Dialog>
    }else{
        setViewInvoice(false);
        return "";
    }
}

// this function will used for validate 
const validate = (values) => {
    const errors = {}
    // this condtions check whtere from date and to date
    if ((values.fromDate && values.toDate) && (!values.fromDate || !values.toDate)) {
        errors.fromDate = "From date is required";
        errors.toDate = "To date is required";
    } else {
        var startDate = new Date(values.fromDate);
        var endDate = new Date(values.toDate);
        if (startDate > endDate || endDate < startDate) {
            errors.fromDate = "From date should be less than end date";
            errors.toDate = "To date should be grater than start date";
        }
    }
    return errors;
}

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    ClientAction: bindActionCreators(ClientAction, dispatch),
    InvoiceAction: bindActionCreators(InvoiceAction, dispatch),
    ProjectAction: bindActionCreators(ProjectAction, dispatch),
    PurchaseOrderAction: bindActionCreators(PurchaseOrderAction,dispatch),
    change: bindActionCreators(change, dispatch)
})
// make the selector 
const selector = formValueSelector('InvoiceFrom')
InvoiceFrom = connect(state => { 
    // can select values individually
    const fromDateProps = selector(state, 'fromDate')
    const toDateProps = selector(state, 'toDate')
    return { ...state,fromDateProps,toDateProps } 
}, mapDispatchToProps)(InvoiceFrom)
export default reduxForm({ form: 'InvoiceFrom', validate })(InvoiceFrom);
