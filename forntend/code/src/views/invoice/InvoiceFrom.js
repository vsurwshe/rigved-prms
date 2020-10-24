import React, { useState, forwardRef } from 'react';
import { reduxForm, change, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Slide, AppBar, Toolbar, IconButton, CircularProgress } from '@material-ui/core';
import useStyles from "../client/Styles";
import { Alert, Autocomplete } from '@material-ui/lab';
import { renderDateTimePicker, renderAutocompleteWithProps } from '../utilites/FromUtilites';
import { Required } from '../utilites/FormValidation';
import * as ClientAction from "../../redux/actions/ClientAction";
import * as ProjectAction from "../../redux/actions/ProjectAction"
import * as InvoiceAction from "../../redux/actions/InvoiceAction"
import * as PurchaseOrderAction from "../../redux/actions/PurchaseOrderAction"
import Invoice from './Invoice';
import CloseIcon from '@material-ui/icons/Close';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MaterialTable from 'material-table';
import moment from 'moment';
import { API_EXE_TIME } from '../../assets/config/Config';

// this method will used for the transition for model 
const Transition = forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} />; });


let InvoiceFrom = (props) => {
    var classes = useStyles();
    const { pristine, reset, submitting, handleSubmit } = props
    const { SaveInvoiceEmployeeData } = props.InvoiceAction
    const [viewInvoice, setViewInvoice] = useState(false);
    const [projectIdList, setProjectIdList] = useState([])
    const [viewSectionThree, setViewSectionThree] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submit, setSubmit] = useState(false)
    return <div className={classes.girdContainer}>
        <form onSubmit={handleSubmit((values) => PostInvoiceData({ "mainProps": props, values, projectIdList, viewSectionThree, setSubmit, setViewSectionThree, setLoading }))}>
            {LoadGird({ "mainProps": props, projectIdList, setProjectIdList, viewSectionThree, setViewSectionThree, loading, setLoading, setViewInvoice })}
            {ShowViewInvoice({ "mainProps": props, classes, viewInvoice, setViewInvoice })}
            <div className={classes.buttonStyle}>
                <center>
                    <Button type="submit" variant="outlined" color="primary" disabled={pristine || submitting || submit}>SUBMIT</Button> &nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" disabled={pristine || submitting} onClick={async () => { await reset(); await SaveInvoiceEmployeeData([]); await setViewSectionThree(false); }}> Clear Values</Button>&nbsp;&nbsp;
                    {/* <Button type="button" variant="outlined" color="secondary" onClick={async () => { await reset(); cancle() }}> Cancel</Button> &nbsp;&nbsp; */}
                    {/* <Button type="button" variant="outlined" color="primary" onClick={() => setViewInvoice(true)}>View Invoice</Button> */}
                </center>
            </div>
        </form>
    </div>
}

// this method will used for the showing invoice after posting successfully resource table
const ShowViewInvoice = (propsData) => {
    const { viewInvoice, setViewInvoice, classes } = propsData
    const { genratedInvoiceData }=propsData.mainProps.InvoiceState 
    return <Dialog fullScreen open={viewInvoice} onClose={() => setViewInvoice(false)} TransitionComponent={Transition}>
        <AppBar className={classes.dialogAppBar} style={{ float: "right" }} >
            <Toolbar >
                <IconButton classes={{ paper: classes.profileMenuIcon }} color="inherit" onClick={() => setViewInvoice(false)} aria-label="close"> <CloseIcon /> </IconButton>
                <DialogTitle>Generated Invoice</DialogTitle>
            </Toolbar>
        </AppBar>
        <DialogContent>
            { genratedInvoiceData ? <Invoice inoiceData={genratedInvoiceData}/>: <h3>Sorry there is no invoice created</h3>}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setViewInvoice(false)} color="primary">Cancel</Button>
            <Button onClick={() => DwonloadInvoice()} color="secondary">Download Invoice</Button>
        </DialogActions>
    </Dialog>
}

// this method will used for the download the invoice table as pdf
const DwonloadInvoice = () => {
    let htmlTable = document.getElementById('invoiceProject');
    html2canvas(htmlTable, {
        allowTaint: true,
        backgroundColor: "rgba(255, 255, 255, 1)",
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.addImage(imgData, 'PNG', 25, 70);
        pdf.save("downloadInvoice.pdf");
    });
}

// this method will used for the saving the genrate invoice
const PostInvoiceData = async (propsData) => {
    const { values, setViewSectionThree, projectIdList, setLoading, setSubmit } = propsData
    const { authorization } = propsData.mainProps.LoginState
    const { invoiceEmployeeData } = propsData.mainProps.InvoiceState
    const { GenerateInvoice, SaveInvoiceEmployeeData } = propsData.mainProps.InvoiceAction
    const { loadMessage } = propsData.mainProps.ClientAction
    const { dispatch } = propsData.mainProps
    let newInvoiceData = {
        "fromDate": (values && values.fromDate) &&  new moment(values.fromDate).format('x'),
        "toDate": (values && values.toDate) && new moment(values.toDate).format('x'),
        "projectId": (projectIdList && projectIdList.length > 0) && projectIdList[0].id
    }
    await setLoading(true);
    await SaveInvoiceEmployeeData([]);
    await GenerateInvoice(newInvoiceData, authorization);
    setTimeout(async () => {
        await dispatch(loadMessage());
        await setLoading(false);
        await setViewSectionThree(true);
        (invoiceEmployeeData && invoiceEmployeeData.length >0)&&await setSubmit(true); 
    }, API_EXE_TIME)
}

// this method will used for the loading gird structure of invoice form component
const LoadGird = (props) => {
    var classes = useStyles();
    const { projectIdList, setProjectIdList, viewSectionThree, setViewSectionThree, loading, setLoading, setViewInvoice } = props
    const { color, common_message } = props.mainProps.ClientState
    return <>
        <Grid container spacing={5}>
            <Grid item xs={12} style={{ padding: 30 }}>
                {(common_message) && <center><Alert color={color}>{common_message}</Alert></center>}
            </Grid>
        </Grid>
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6} style={{ paddingLeft: 30, paddingTop: 30 }}>
                {SectionOne({ classes, "mainProps": props.mainProps, projectIdList, setProjectIdList })}
            </Grid>
            <Grid item xs={12} sm={6} style={{ paddingLeft: 30, paddingTop: 30 }} >
                {SectionTwo({ classes, "mainProps": props.mainProps })}
            </Grid>
        </Grid>
        <center>{loading && LoadingCircle("Saving")}</center>
        <Grid container spacing={5} style={{ paddingLeft: 10, paddingTop: 20 }}>
            <Grid item xs={12}>
                {viewSectionThree && SectionThree({ "mainProps": props.mainProps , viewSectionThree, setViewSectionThree, projectIdList, setLoading, setViewInvoice})}
            </Grid>
        </Grid>

    </>
}

// this method will used for the loading bar
const LoadingCircle = (message) => <center> {message} <CircularProgress size={40} /> </center>

// this method will used for the load the left side part 
const SectionOne = (data) => {
    const { setProjectIdList } = data
    const { listOfClient } = data.mainProps.ClientState
    const { authorization } = data.mainProps.LoginState
    const { projectListByClient } = data.mainProps.ProjectState
    // const { purchaseOrderListByName } = data.mainProps.PurchaseOrderState
    const { GetClientList } = data.mainProps.ClientAction
    const { GetProjectListByClient } = data.mainProps.ProjectAction
    // const { GetPurchaseOrderListByName,SavePurchaseOrderListByName }=data.mainProps.PurchaseOrderAction
    const [clientCall, setClientCall] = useState(0);

    // let purchaseOrderOptions = purchaseOrderListByName.length > 0 && purchaseOrderListByName.map((item, key) => {
    //     return { title: item.poNum ? item.poNum : "", id: item.id }
    // })

    if (listOfClient.length <= 0 && clientCall === 0) {
        GetClientList(0, 20, authorization);
        setClientCall(clientCall + 1);
    }

    // this is returning client option 
    let clientOptions = (listOfClient && listOfClient.length > 0) && listOfClient.map((item, key) => {
        return { title: item.clientName ? item.clientName : "", id: item.id }
    })

    // this is returning project option
    let projectOptions = (projectListByClient && projectListByClient.length > 0) && projectListByClient.map((item, key) => {
        return { title: item.clientName ? item.projectName : "", id: item.id }
    })

    return <>
        <Field name="clientName" component={renderAutocompleteWithProps}
            onChange={(value) => {
                change('ProjectForm', 'clientName', value.title);
                // SavePurchaseOrderListByName([]);
                GetProjectListByClient(0, 20, value.id, authorization)
                // GetPurchaseOrderListByName(0, 20, value.id, authorization)
            }}
            optionData={clientOptions} label="Client Name" validate={[Required]} />
        {/* <Field name="poNum" component={renderAutocompleteWithProps}
            onChange={(value) => {
                change('ProjectForm', 'poNum', value.title);
                // GetProjectListByClient(0, 20, value.id, authorization)
            }}
            optionData={purchaseOrderOptions} label="Purchase Order Number" validate={[Required]} /> */}
        <Autocomplete
            id="projectList"
            autoHighlight
            multiple
            options={(projectOptions && projectOptions.length > 0) ? projectOptions : []}
            getOptionLabel={projectOptions => (projectOptions && projectOptions.title) && projectOptions.title}
            getOptionSelected={(option, value) => option.id === value.id}
            onChange={(event, value) => value && setProjectIdList(value)}
            renderInput={(params) => (<TextField {...params} label="Project" margin="normal" />)}
        />
    </>
}

// this method will used for the right side part of this component
const SectionTwo = (data) => {
    const { classes } = data
    return <>
        <Field name="fromDate" component={renderDateTimePicker} className={classes.textField} label="From Date" helperText="Ex. 01/01/2000" validate={[Required]} />
        <Field name="toDate" component={renderDateTimePicker} className={classes.textField} label="To Date" helperText="Ex. 01/01/2000" validate={[Required]} />
    </>
}

// this is month name array
var months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

// this sections will used for the showing structure
const SectionThree = (propsData) => {
    const { setViewSectionThree, setLoading, setViewInvoice }=propsData
    const { invoiceEmployeeData } = propsData.mainProps.InvoiceState
    // this condition checks the invoice employee data is there or not
    if(invoiceEmployeeData.length >0 ){
        let columns = [
            { title: "EMP\u00a0ID", field: "employeeId" },
            { title: "EMP\u00a0NAME", field: "employeeName" },
            { title: "PER\u00a0DAY\u00a0RATE", field: "perDayRate" },
            { title: "TOTAL\u00a0DAYS", field: "totalDays" },
            { title: "TOTAL\u00a0AMOUNT", field: "totalAmt" }
        ];
        let data = [];
        (invoiceEmployeeData && invoiceEmployeeData.length > 0) && invoiceEmployeeData.map((item, key) => {
            let monthString = item.attendancepermonth ? item.attendancepermonth : "";
            let firstArray = monthString && monthString.split(',');
            let tempColunmsData = [];
            data.push({
                "data":item,
                "employeeId": item.employeeId,
                "employeeName": item.employeeName,
                "perDayRate": item.perDayRate,
                "totalDays": item.totalDays,
                "totalAmt": item.totalAmt
            })
            firstArray.forEach(element => {
                let monthNumber;
                let filterEqualArray;
                if (element.includes("{")) {
                    let tempArray = element.split('{')
                    filterEqualArray = tempArray[1].split("=");
                } else if (element.includes("}")) {
                    let tempArray = element.split('}')
                    filterEqualArray = tempArray[0].split("=");
                } else {
                    filterEqualArray = element.split("=");
                }
                monthNumber = filterEqualArray && filterEqualArray[0].replace(/ /g, "");
                key === 0 && tempColunmsData.push({ title: months[monthNumber], field: months[monthNumber] })
                data[key][months[monthNumber]] = (filterEqualArray[1] && filterEqualArray[1].includes("}")) ? (filterEqualArray[1].split('}')[0]) : filterEqualArray[1]
            });
            columns.splice(5, 0, ...tempColunmsData)
            return "";
        })
        return LoadInvoiceResourceTable({ columns, data, "mainProps": propsData.mainProps, projectIdList: propsData.projectIdList, setLoading, setViewInvoice });
    }else{
        return setViewSectionThree(false);
    }
}

// this method will used for the loading resource table
const LoadInvoiceResourceTable = (propsData) => {
    const { columns, data, projectIdList, setLoading, setViewInvoice } = propsData
    return <div style={{ maxWidth: "100%" }}>
        <MaterialTable
            title=""
            columns={columns}
            data={data.length > 0 ? data : []}
            options={{
                headerStyle: { backgroundColor: '#01579b', color: '#FFF' },
                search: false,
                selection: true
            }}
            actions={[{   
                icon: () => <div><Button variant="contained" color="primary">Generate Invoice</Button></div>,
                onClick: (event, rowData) =>{
                    let tempInvoiceDetails= (rowData && rowData.length >0) && rowData.map((item,key)=>item.data);
                    if(tempInvoiceDetails){
                        GenratePDFInvoice({invoiceDetailDtos: tempInvoiceDetails, "mainProps":propsData.mainProps, projectIdList, setLoading, setViewInvoice })
                    } 
                },
                tooltip: 'Generate Invoice'
            }]}
        />
    </div>
}

const GenratePDFInvoice=async (propsData)=>{
    const { projectIdList, invoiceDetailDtos, setLoading, setViewInvoice }=propsData
    const { fromDateProps, toDateProps }=propsData.mainProps
    const { authorization }=propsData.mainProps.LoginState
    const { loadMessage } = propsData.mainProps.ClientAction
    const { genratedInvoiceData } = propsData.mainProps.InvoiceState
    const { GenerateInvoicePDF, SaveGenratedInvoiceData}=propsData.mainProps.InvoiceAction
    let newInvoiceGenratePDFData={
        "fromDate":fromDateProps && fromDateProps ,
        "toDate": toDateProps && toDateProps ,
        "projectId": (projectIdList.length>0) && projectIdList[0].id,
        "invoiceDetailDtos": (invoiceDetailDtos.length>0 )&& invoiceDetailDtos
    }
    await setLoading(true);
    await SaveGenratedInvoiceData([]);
    await GenerateInvoicePDF(newInvoiceGenratePDFData, authorization);
    setTimeout(async () => {
        await loadMessage();
        await setLoading(false);
        (genratedInvoiceData && genratedInvoiceData.length >0) && await setViewInvoice(true);
    }, API_EXE_TIME)
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