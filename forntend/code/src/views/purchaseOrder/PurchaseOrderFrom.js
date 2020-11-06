import React from 'react';
import { reset, reduxForm, Field, change } from 'redux-form';
import { connect } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import useStyles from "../client/Styles";
import { renderTextField, renderDateTimePicker, renderFileInput, renderTextHiddenField, renderAutocompleteWithProps, renderLoading } from '../utilites/FromUtilites';
import { Required } from '../utilites/FormValidation';
import { FromActions } from '../../assets/config/Config';
import * as FileAction from "../../redux/actions/FileAction";
import { Alert } from '@material-ui/lab';
import { bindActionCreators } from 'redux';

let PurchaseOrderForm = (props) => {
    var classes = useStyles();
    const { SaveMethod, pristine, reset, submitting, handleSubmit, cancle, initialValues, clearFile } = props
    const { operation } = props.stateData
    return <div className={classes.girdContainer}>
        <form onSubmit={handleSubmit(SaveMethod)}>
            {LoadGird(props)}
            <div className={classes.buttonStyle}>
                <center>
                    {(operation === FromActions.CR || operation === FromActions.ED) && <>
                    <Button type="submit" variant="outlined" color="primary" disabled={pristine || submitting}> {(initialValues === undefined) ? "SUBMIT" : "EDIT"}</Button> &nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" disabled={pristine || submitting} onClick={reset}> Clear Values</Button></>}&nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" onClick={async () => { await clearFile(); await reset(); cancle() }}> Cancel</Button>
                </center>
            </div>
        </form>
    </div>
}

// this method used for the loading from structure
const LoadGird = (props) => {
    var classes = useStyles();
    const { initialValues } = props
    const { color, common_message } = props.PurchaseOrderState
    return <>
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6} style={{ paddingLeft: 30, paddingTop: 20 }}>
                <center>{common_message && <Alert color={color} >{common_message}</Alert>}</center>
                {SectionOne({ classes, props, initialValues })}
            </Grid>
            <Grid item xs={12} sm={6} style={{ paddingTop: 50 }}>
                {SectionTwo({ classes, props, initialValues })}
            </Grid>
        </Grid>
        <Grid container spacing={5} style={{ paddingLeft: 10, paddingTop: 20, paddingRight:10 , paddingBottom:20}}>
            <Grid item xs={12}>
                {(initialValues !== undefined) && SectionThree({ classes, initialValues, props })}
            </Grid>
        </Grid>
    </>
}

// this method will load the sections first 
const SectionOne = (data) => {
    const { classes, initialValues } = data
    const { uploadFile } = data.props
    const { operation, purchaseOrderFileUrl, purchaseOrderFileUpload } = data.props.stateData
    return <>
        {operation === FromActions.CR ? LoadFields({ classes,"mainProps":data.props }) : LoadHeader({ classes, initialValues })}
        {operation === FromActions.CR &&
            <>{(purchaseOrderFileUpload) ? renderLoading({message:"Uploading...", size:40})
                : (purchaseOrderFileUrl ? LoadFileUrl({ "url": purchaseOrderFileUrl, "cid": 1, "mainProps": data.props, "componentName": "Purchase Order Image", "style": { height: "50%", width: "70%" } })
                    : <Field name="poCntrUrl" component={renderFileInput} fullWidth type="file" successFunction={uploadFile} lable="Purchase Order File" />)
            }</>}
    </>
}

// this method used for the showing image
let LoadFileUrl = (parameter) => {
    const { listOfFiles } = parameter.mainProps.FileState
    const exitsData = (listOfFiles.length > 0) && listOfFiles.filter(x => (x.cid === parameter.cid && x.fileName === parameter.url));
    if (exitsData === false || exitsData.length <= 0) { GetPhotos(parameter) }
    return <iframe title="POFileUrl" type="application/pdf" src={exitsData.length > 0 && exitsData[0].fileData}  style={{ width: "100%", height: "100%" }} />
}

// this method used for the load the image form api
const GetPhotos = async (parameter) => {
    const { FetchPhoto } = parameter.mainProps.FileAction
    const { authorization } = parameter.mainProps.LoginState
    return await FetchPhoto(parameter.url, authorization, parameter.cid,"application/pdf");
}

// this method used for the load the fileds value for name and purchase order number
const LoadFields = (parameter) => {
    const { classes,initialValues } = parameter
    const { listOfClient }=parameter.mainProps.ClientState
    const { change } = parameter.mainProps
    let clientOptions = listOfClient.length > 0 && listOfClient.map((item, key) => {
        return { title: item.clientName ? item.clientName : "", id: item.id }
    })
    return <>
        <Field name="poNum" component={renderTextField} fullWidth label="Purchase Order Number" helperText="Ex. po121-20/21" validate={[Required]} style={{marginTop:30}} />    
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6} >
                <Field name="clientName" component={renderAutocompleteWithProps}
                    onChange={(value) => {
                        change('PurchaseOrderForm', 'clientName', value.title);
                        change('PurchaseOrderForm', 'clientId', value.id);
                    }}
                    optionData={clientOptions} label="Client Name" validate={[Required]} />
                <Field name="clientId" component={renderTextHiddenField} />
            </Grid>
            <Grid item xs={12} sm={6} style={{marginTop:15}}>
                <Field name="poAmount" component={renderTextField} className={classes.textField} label="Puchase Order Amount" helperText={(initialValues === undefined) && "Ex. 10000"} validate={[Required]} />
            </Grid>
        </Grid>
    </>
}

// this method will load the header part
const LoadHeader = (parameter) => {
    const { classes, initialValues } = parameter
    return <>
        <h2 className={classes.textField}>{initialValues.clientName}</h2>
        <h4>Purchase Order Number:&nbsp;&nbsp;{initialValues.poNum}</h4>
        <Field name="poAmount" component={renderTextField} className={classes.textField} label="Puchase Order Amount" helperText={(initialValues === undefined) && "Ex. 10000"} disabled validate={[Required]} />
    </>
}

// this method will load the sections second 
const SectionTwo = (data) => {
    const { classes, initialValues } = data
    const { operation } = data.props.stateData
    return <>
        <Field name="validFrom" component={renderDateTimePicker} className={classes.textField} label="Valid From" helperText={(initialValues === undefined) && "Ex. 01/01/2000"} disabled={operation === FromActions.VI} validate={[Required]} />
        <Field name="validTo" component={renderDateTimePicker} className={classes.textField} label="Valid to" helperText={(initialValues === undefined) && "Ex. 01/01/2000"} disabled={operation === FromActions.VI} validate={[Required]} />
        {operation === FromActions.VI &&<> 
            <Field name="invAmnt" component={renderTextField} disabled={true} className={classes.textField} label="Invoiced Amount" />
            <Field name="balPoAmt" component={renderTextField} disabled={true} className={classes.textField} label="Balance" /></>}
    </>
}

// this method will load the sections three 
const SectionThree = (data) => {
    const { initialValues } = data
    return LoadFileUrl({
        "url": initialValues.poCntrUrl,
        "cid": initialValues.id,
        "mainProps": data.props,
        "componentName": "Purchase Order Image",
        "style": { width: "100%", height: "100%" }
    })
}
const mapDispatchToProps = (dispatch) => ({
    FileAction: bindActionCreators(FileAction, dispatch),
    change: bindActionCreators(change, dispatch)
})
PurchaseOrderForm = connect(state => { return { ...state } }, mapDispatchToProps)(PurchaseOrderForm)
const afterSubmit = (result, dispatch) => dispatch(reset('PurchaseOrderForm'));
export default reduxForm({ form: 'PurchaseOrderForm', onSubmitSuccess: afterSubmit })(PurchaseOrderForm);

