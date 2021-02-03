import React, { useState } from 'react';
import { Grid, Button, FormLabel } from '@material-ui/core';
import { reset, reduxForm, Field, FieldArray, formValueSelector, getFormSyncErrors } from 'redux-form';
import SimpleTabs from './TabPanleUtilites';
import { renderTextField, renderContact, renderTextHiddenField, renderFileInput, renderTextAreaField, renderLoading, renderSanckbarAlert } from '../utilites/FromUtilites';
import useStyles from "../client/Styles";
import { connect } from 'react-redux';
import RateCardTable from '../rateCard/RateCardTable';
import ContactTable from '../contact/ContactTable';
import { Required,  GSTIN, TAN, IFSCCode, BankAccount } from '../utilites/FormValidation';
import * as FileActions from "../../redux/actions/FileAction";
import { FromActions } from '../../assets/config/Config';


// this is main compoent
let ClientForm = (props) => {
    var classes = useStyles();
    const { SaveClientMethod, pristine, reset, submitting, handleSubmit, cancle, clearFile,rateCardDtosProps } = props
    const { operation } = props.stateData
    const [rateCardDtos,setRateCardDtos] = useState([])
    const [rateCardCountCall, setRateCardCountCall] = useState(0)
    if(rateCardDtosProps && rateCardDtosProps.length >0 && rateCardCountCall===0){
        setRateCardCountCall(rateCardCountCall+1);
        setRateCardDtos(rateCardDtosProps)
    }
    return <div className={classes.girdContainer}>
        <form onSubmit={handleSubmit((values)=> SaveClientMethod({values,rateCardDtos}))}>
            {LoadGird({"mainProps":props,rateCardDtos,setRateCardDtos })}
            <div className={classes.buttonStyle}>
                <center>
                    {(operation === FromActions.ED || operation === FromActions.CR) && <>
                    <Button type="submit" variant="outlined" color="primary">SUBMIT</Button> &nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" disabled={pristine || submitting} onClick={reset}> Clear Values</Button></>}&nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" onClick={async () => { await clearFile(); await reset(); cancle() }}> Cancel</Button>
                </center>
            </div>
        </form>
    </div>
}

const LoadGird = (propsData) => {
    var classes = useStyles();
    const { rateCardDtos,setRateCardDtos, mainProps } = propsData
    const { contactPersonDtos, initialValues } = mainProps
    const { Domains, SkillCategory, SkillSet } = mainProps.MasterDataSet
    const { clientDetails }=mainProps.ClientState
    const { message, Status}=clientDetails
    return <>
        {(message && Status) && ((Status === 'OK')? renderSanckbarAlert({ message,color:"success"}) :renderSanckbarAlert({ message,color:"error"}))}
        <Grid container spacing={5}>
            <Grid item style={{ paddingLeft: 30 }}>
                {HeaderPart({ classes, initialValues, mainProps:mainProps })}
            </Grid>
        </Grid>
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6} style={{ paddingLeft: 30 }}>
                {(initialValues === undefined) ? SectionOne({ classes, "mainProps":mainProps }) : EditSectionOne({ classes, initialValues })}
            </Grid>
            <Grid item xs={12} sm={6}>
                {SectionTwo({ classes,"mainProps":mainProps })}
            </Grid>
        </Grid>
        <Grid container spacing={5} style={{ paddingLeft: 10 }}>
            <Grid item xs={12}>
                {SectionThree({ classes, contactPersonDtos, Domains, SkillCategory, SkillSet,"mainProps":mainProps,rateCardDtos,setRateCardDtos })}
            </Grid>
        </Grid>
    </>
}
// this method used for the load header part
const HeaderPart = (propsData) => {
    const { initialValues } = propsData
    return <Grid item container direction="row" justify="center" alignItems="center" >
        {(initialValues !== undefined) && <h2>{initialValues.clientName}</h2>}
    </Grid>
}

// section one
const SectionOne = (data) => {
    const { classes, initialValues } = data
    return <div>
        <Field name="id" component={renderTextHiddenField} />
        <Field name="clientName" component={renderTextField} fullWidth label="Client Name" helperText="Ex. Rigved Tech. Pvt. Ltd." validate={ (initialValues===undefined) && [Required]} />
        <Field name="tanNum" component={renderTextField} className={classes.textField} label="TAN No." helperText="Ex. PDES03028F" validate={(initialValues===undefined) &&[Required, TAN]} />
        <Field name="gstNum" component={renderTextField} className={classes.textField} label="GST No." helperText="Ex. 24AAACC1206D1ZM" validate={(initialValues===undefined) && [Required, GSTIN]} />
    </div>
}

// section one
const EditSectionOne = (data) => {
    const { initialValues } = data
    return <div>
        <Field name="id" component={renderTextHiddenField} />
        <Field name="clientName" component={renderTextHiddenField} validate={[Required]} />
        <Field name="tanNum" component={renderTextHiddenField} />
        <Field name="gstNum" component={renderTextHiddenField} />
        <FormLabel component="legend">GST Number :{initialValues.gstNum}</FormLabel><br />
        <FormLabel component="legend">TAN Number :{initialValues.tanNum}</FormLabel>
    </div>
}

// section two
const SectionTwo = (data) => {
    const { operation } = data.mainProps.stateData
    return (operation !== FromActions.VI) ? AddressDto(data) : AddressTextArea();
}

// this method used for the load the address into text area
const AddressTextArea = () => {
    return <Field
        name="addressDtos"
        validate={[Required]}
        format={address => address ? ("" + address.addressLine + "," + address.area + "," + address.city + ((address.state !== null) ? ("," + address.state + ",") : ",") + address.pincode) : ""}
        parse={value => JSON.parse(value)}
        component={renderTextAreaField}
        maxRows={2} label="HQ Address"
        fullWidth 
        disabled
        />
}

// this method used for the show the address inputs 
const AddressDto = (props) => {
    const { classes, initialValues } = props
    return <>
        <Field name="addressDtos.addressLine" component={renderTextField} validate={ (initialValues === undefined) && [Required]} fullWidth label="Address Line" helperText="Ex. Sector 1" />
        <Field name="addressDtos.city" component={renderTextField} validate={(initialValues === undefined) &&[Required]} className={classes.textField} label="City" helperText="Ex. Navi Mumbai" />
        <Field name="addressDtos.area" component={renderTextField} className={classes.textField} label="Area" helperText="Ex. Mahape" />
        <Field name="addressDtos.state" component={renderTextField} validate={(initialValues === undefined) &&[Required]} className={classes.textField} label="State" helperText="Ex. Maharashtra" />
        <Field name="addressDtos.pincode" component={renderTextField} validate={(initialValues === undefined) &&[Required]} className={classes.textField} label="Pincode" helperText="Ex. 400001" />
    </>
}

// section three
const SectionThree = (data) => {
    const tabsData = [
        { label: "Contact Person", component: ContactAddress(data) },
        { label: "Financials", component: Financials(data.mainProps) },
        { label: "Rate Card", component: RateCard(data) }
    ]
    return <SimpleTabs tabData={tabsData} />
}


// financials tab
const Financials = (data) => {
    const { gstFileUpload, tanFileUpload, initialValues } = data
    const { gstFileUrl, tanFileUrl, gstUpload, tanUpload } = data.stateData
    return <>
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6} style={{ paddingLeft: 30 }}>
                {BankDetailsDto()}
            </Grid>
            <Grid item xs={12} sm={4}>
                <Grid item xs={12}>
                    {((gstFileUrl === "" || gstFileUrl === undefined) && initialValues === undefined) ? (gstUpload ? renderLoading({message:"Uploading", size:40}) : <Field name="gstUrl" component={renderFileInput} type="file" successFunction={gstFileUpload} validate={[Required]} lable="GST Card Image" />)
                        : <>{initialValues === undefined ?(<h5>GST File: {LoadFileUrlName(gstFileUrl)}</h5>)
                            : LoadFileUrl({ "url": initialValues.gstUrl, "cid": initialValues.id, "props": data, "componentName": "GST Image" })} </>
                    }
                </Grid>
                <Grid item xs={12}>
                    {((tanFileUrl === "" || tanFileUrl === undefined) && initialValues === undefined) ? (tanUpload ? renderLoading({message:"Uploading", size:40}) : <Field name="gstUrl" component={renderFileInput} type="file" successFunction={tanFileUpload} validate={[Required]} lable="TAN Card Image" />)
                        : <>{initialValues === undefined ? (<h5>TAN File: {LoadFileUrlName(tanFileUrl)}</h5>)
                            : LoadFileUrl({ "url": initialValues.tanUrl, "cid": initialValues.id, "props": data, "componentName": "TAN Image" })} </>
                    }
                </Grid>
            </Grid>
        </Grid>
    </>
}

const LoadFileUrlName = (fileUrl) => {
    let fileArray = fileUrl.split("\\");
    return fileArray.length > 0 ? fileArray[5] : "";
}

let LoadFileUrl = (parameter) => {
    const { listOfFiles } = parameter.props.FileState
    const exitsData = (listOfFiles.length > 0) && listOfFiles.filter(x => (x.cid === parameter.cid && x.fileName === parameter.url));
    if ((exitsData === false || exitsData.length <= 0) && parameter.url) { GetPhotos(parameter) }
    return <>{parameter.componentName}:<img src={exitsData.length > 0 && exitsData[0].fileData} alt={parameter.componentName} style={{ height: "50%", width: "70%" }} /></>;
}

const GetPhotos = async (parameter) => {
    const { FetchPhoto, props } = parameter.props
    const { authorization } = props.LoginState
    return await FetchPhoto(parameter.url, authorization, parameter.cid);
}

// this will be load the bank details related fields
const BankDetailsDto = () => {
    return <span> <Field name="bankDetailsDtoList.accountNumber" component={renderTextField} validate={[Required, BankAccount]} label="Account Number" fullWidth helperText="Ex. 3456231234567" />
        <Field name="bankDetailsDtoList.ifscCode" component={renderTextField} validate={[Required, IFSCCode]} label="IFSC Code" fullWidth helperText="Ex. SBIN0000123" />
        <Field name="bankDetailsDtoList.bankName" component={renderTextField} label="Bank Name" fullWidth helperText="Ex. State Bank of India" />
        <Field name="bankDetailsDtoList.branchName" component={renderTextField} label="Branch Name" fullWidth helperText="Ex. Mumbai" />
    </span>
}

// rate card
const RateCard = (data) => {
    const { Domains, SkillCategory, SkillSet, rateCardDtos,setRateCardDtos} = data
    const { operation }=(data.mainProps && data.mainProps.stateData) ? data.mainProps.stateData : ""
    const { initialValues } = data.mainProps
    let rateOptions=[{id: 1, name: "Monthly"},{id:1, name:"Daily"},{ id: 3, name:"Hourly"}]
    return <RateCardTable 
        operation={operation} 
        data={data} 
        rateOptions={rateOptions} 
        SkillCategory={SkillCategory} 
        Domains={Domains} 
        SkillSet={SkillSet} 
        rateCardDtos={rateCardDtos} 
        setRateCardDtos={setRateCardDtos} 
        initialValues={initialValues} 
    />
}

// contact address
const ContactAddress = (data) => {
    const [open, setOpen] = useState(false);
    const handleClickOpen = (fields) => { setOpen(true); fields.push({}) };
    const handleClose = () => { setOpen(false) };
    const { contactPersonDtos, classes } = data
    const { initialValues}=data.mainProps
    const { operation }=(data.mainProps && data.mainProps.stateData) ? data.mainProps.stateData : ""
    return <span>
        <FieldArray name="contactPersonDtos" 
            classes={classes} 
            open={open}
            initialValues={initialValues}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            component={renderContact} 
            // validate={[Required]} 
            operation={operation}/>
        <ContactTable data={contactPersonDtos}  />
    </span>
}

// make the selector 
const selector = formValueSelector('ClientForm')
ClientForm = connect(state => {
    // can select values individually
    const rateCardDtosProps = selector(state, 'rateCardDtos')
    const contactPersonDtos = selector(state, 'contactPersonDtos')
    const ClientFromError= getFormSyncErrors('ClientForm')(state)
    return { rateCardDtosProps, contactPersonDtos, ...state, ClientFromError }
}, FileActions)(ClientForm)

const afterSubmit = (result, dispatch) => dispatch(reset('ClientForm'));
export default reduxForm({  form: 'ClientForm',  onSubmitSuccess: afterSubmit, enableReinitialize: true   })(ClientForm);
