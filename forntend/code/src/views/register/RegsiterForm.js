import React from 'react';
import { Button, Grid, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { Field, reduxForm, reset } from 'redux-form';
import { renderTextField, renderAutocompleteByName, renderDateTimePicker, radioButton, renderNumberField, renderFileInput, renderPasswordTextField, renderLoading } from '../utilites/FromUtilites';
import useStyles from "./styles";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MasterDataAction from '../../redux/actions/MasterDataAction';

let RegisterFrom = (props) => {
    var classes = useStyles();
    const { RegisterUser, pristine, reset, submitting, handleSubmit, clearFile, cancle } = props
    return <div className={classes.girdContainer}>
        <form onSubmit={handleSubmit(RegisterUser)}>
            {LoadGird({ classes, props })}
            <div className={classes.buttonStyle}>
                <center>
                    <Button type="submit" variant="outlined" color="primary" disabled={pristine || submitting}> Submit </Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" disabled={pristine || submitting} onClick={reset}> Clear Values</Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" onClick={async () => { await clearFile(); await reset(); cancle() }}> Cancel</Button>
                </center>
            </div>
        </form>
    </div>
}

const LoadGird = (propsData) => {
    const { classes, props } = propsData
    return <>
        <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
                {SectionOne({ classes, "mainProps": props })}
            </Grid>
            <Grid item xs={12} sm={6}>
                {SectionTwo({ classes })}
            </Grid>
        </Grid>
    </>
}

const SectionOne = (props) => {
    const { classes } = props
    const { Domains, SkillSet, RoleList } = props.mainProps.MasterDataSet
    return <div className={classes.root}>
        <div>
            {PersonalInfo({ classes, "mainProps": props.mainProps })}
            {Skills({ classes, SkillSet })}
            {Assign({ classes, Domains, RoleList })}
        </div>
    </div>
}

const PersonalInfo = (props) => {
    const { classes } = props
    const { profileImageUploadMethod } = props.mainProps
    const { profileImageUpload, profileImageUrl } = props.mainProps.stateData
    return <Accordion expanded={true}>
        <AccordionSummary aria-label="Expand" aria-controls="additional-actions1-content"> PERSONAL INFORMATION</AccordionSummary>
        <AccordionDetails>
            <div>
                {(profileImageUrl === "" || profileImageUrl === undefined) ? (profileImageUpload ? renderLoading({message:"Uploading..", size:40})
                    : <Field name="profilePic" component={renderFileInput} fullWidth successFunction={profileImageUploadMethod} type="file" lable="Profile Image" />)
                    : <h5>{loadFileUrlName(profileImageUrl)}</h5>}
                <Field name="designation" component={renderTextField} label="Job Title" style={{ margin: 8 }} fullWidth helperText="Ex. Java Full Stack Developer" margin="normal" InputLabelProps={{ shrink: true }} />
                <Field name="firstName" className={classes.textField} component={renderTextField} label="First Name" />
                <Field name="lastName" className={classes.textField} component={renderTextField} label="Last Name" />
                <Field name="expInYears" className={classes.textField} component={renderNumberField} label="Experience" helperText="Ex. 2 years" margin="normal" />
                <Field name="password" className={classes.textField} component={renderPasswordTextField} label="Password" margin="normal" helperText="Password must contain [1...9][A...Z] and any special symbol" />
                <Field name="gender" className={classes.textField} component={radioButton} mainLableName="Gender" label={["male", "female"]} />
            </div>
        </AccordionDetails>
    </Accordion>
}

const loadFileUrlName = (fileUrl) => {
    let fileArray = fileUrl.split("\\");
    return fileArray.length > 0 ? fileArray[5] : "";
}

const Skills = (props) => {
    const { SkillSet } = props
    return <Accordion>
        <AccordionSummary aria-label="Expand" aria-controls="additional-actions1-content"> SKILLS INFORMATION</AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                    <Field name="primerySkill" component={renderAutocompleteByName} optionData={SkillSet} label="Primary Skill" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="secounderySkill" component={renderAutocompleteByName} optionData={SkillSet} label="Secondary Skill" />
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
}

const Assign = (props) => {
    const { Domains, RoleList } = props
    return <Accordion>
        <AccordionSummary aria-label="Expand" aria-controls="additional-actions1-content"> ASSIGN ROLES</AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                    <Field name="userType" component={renderAutocompleteByName} optionData={RoleList} label="Roles" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field name="domain" component={renderAutocompleteByName} optionData={Domains} label="Domain" />
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
}

const SectionTwo = (props) => {
    const { classes } = props
    return <div>
        {ContactInfo({ classes })}
        {OtherInfo({ classes })}
    </div>
}

const ContactInfo = (props) => {
    return <Accordion expanded={true}>
        <AccordionSummary aria-label="Expand" aria-controls="additional-actions1-content" > CONTACT INFORMATION</AccordionSummary>
        <AccordionDetails>
            <div>
                <Field name="emailId" component={renderTextField} label="Work Mail" style={{ margin: 8 }} fullWidth helperText="Ex. admin@rigvedtech.com" margin="normal" InputLabelProps={{ shrink: true }} />
                <Field name="mobileNumber" component={renderTextField} label="Phone" style={{ margin: 8 }} fullWidth helperText="Ex. 7653434533" margin="normal" InputLabelProps={{ shrink: true }} />
            </div>
        </AccordionDetails>
    </Accordion>
}

const OtherInfo = (propsData) => {
    const { classes }=propsData
    return <Accordion>
        <AccordionSummary aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header" > OTHER INFORMATION</AccordionSummary>
        <AccordionDetails>
            <div>
                <Field name="employeeNumber" component={renderTextField} label="Employee Code" style={{ margin: 8 }} helperText="Ex. RV0001 " margin="normal" InputLabelProps={{ shrink: true }} />
                <Field name="ctc" component={renderTextField} className={classes.textField} style={{ margin: 8 }} label="CTC" helperText="Ex. 5000" margin="normal" InputLabelProps={{ shrink: true }} />
                <Field name="joiningDate" component={renderDateTimePicker} className={classes.textField} style={{ margin: 8 }} label="Joining Date" helperText="Ex. 01/01/2000"  margin="normal" />
                <Field name="dob" component={renderDateTimePicker} className={classes.textField} style={{ margin: 8 }} label="Date of Birth" helperText="Ex. 15/02/2020" margin="normal" />
            </div>
        </AccordionDetails>
    </Accordion>
}

const mapDispatchToProps = (dispatch) => ({
    MasterDataAction: bindActionCreators(MasterDataAction, dispatch),
})

const validate = (values) => {
    const errors = {}
    // this condition checks employee number is provide or not
    if (!values.employeeNumber) {
        errors.employeeNumber = 'Employee Number is Required'
    }

    // this condition checks employee expriance is not provide negtive value
    if (values.expInYears && values.expInYears < 0) {
        errors.expInYears = "Experience is not negative value"
    }

    // this condition checks employee primary skill and secondary skill should not be same
    if (values.primerySkill && values.primerySkill === values.secounderySkill && values.primerySkill !== "") {
        errors.primerySkill = "Primary and secondary skills should not be same"
        errors.secounderySkill = "Primary and secondary skills should not be same"
    }

    // this condition checks employee password should conatin all required data
    if (values.password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i.test(values.password)) {
        errors.password = "Password should contain minimum eight characters, at least one letter [A...Za...Z], one number[1...9] and one special character";
    }
    return errors
}

RegisterFrom = connect(state => { return { ...state } }, mapDispatchToProps)(RegisterFrom)
const afterSubmit = (result, dispatch) => {dispatch(reset('RegisterFrom'))};
export default reduxForm({ form: 'RegisterFrom', validate, onSubmitSuccess: afterSubmit })(RegisterFrom);
