import React from 'react';
import { TextField, FormControlLabel, Checkbox, FormControl, RadioGroup, Radio, FormHelperText, InputLabel, Select, FormLabel, Button, CircularProgress } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Required, PhoneNumber, Email } from '../utilites/FormValidation';
import { FromActions } from '../../assets/config/Config';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Field } from 'redux-form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CheckBox } from '@material-ui/icons';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// this is render text filed
const renderTextField = ({ label, name, input, helperText, meta: { touched, invalid, error }, ...custom }) => (
    <TextField
      id={name}
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={(touched && error) ? error : helperText}
      {...input}
      {...custom}
    />
  )

// this is render password text filed
const renderPasswordTextField = ({ label, name, input,helperText, meta: { touched, invalid, error }, ...custom }) => (
  <TextField
    id={name}
    type="password"
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={error ? error : helperText}
    {...input}
    {...custom}
  />
)

// this is render text filed
const renderTextHiddenField = ({ label, name, input, meta: { touched, invalid, error }, ...custom }) => (
  <TextField
    id={name}
    label={label}
    type="hidden"
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
)

// this is render text area filed
const renderTextAreaField = ({ maxRows,name,label,helperText, input, meta: { touched, invalid, error }, ...custom }) => (
  <TextField
    id={name}
    label={label}
    placeholder={label}
    multiline
    rows={maxRows}
    error={touched && invalid}
    helperText={error ? error: helperText}
    {...input}
    {...custom}
  />
)

// this is render text filed
const renderNumberField = ({ label, name, input, helperText, meta: { touched, invalid, error }, ...custom }) => (
  <TextField
    id={name}
    type="number"
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={(error && touched) ? error: helperText}
    {...input}
    {...custom}
  />
)

// this will render the file input
const renderFileInput = ({ input, lable, successFunction, type, meta, ...custom }) => {
  return <label htmlFor={input.name}>
          <input style={{ display: 'none' }} id={input.name} name={input.name} type={type} onChange={event =>handleChange(event, input, successFunction)} />
          <Button color="secondary" variant="contained" component="span" style={{marginTop:10, marginBottom:20}} > Upload {lable}</Button>
        </label>
};

const handleChange = async(event, input, successFunction) => {
  event.preventDefault();
  let imageFile = event.target.files[0];
  if (imageFile) {
    var reader = new FileReader();
    reader.onload =async()=>{
      let byteArray=reader.result.split(",")
      successFunction && successFunction(byteArray.length >0 && byteArray[1],imageFile.name,imageFile.type)
    };
    reader.onerror = function (error) { console.log('Error: ', error); };
    await reader.readAsDataURL(imageFile);
  }
};

// this is render the checkbox 
const renderCheckbox = ({ input, label }) => (
  <FormControlLabel control={ <Checkbox checked={input.value ? true : false} onChange={input.onChange} /> } label={label} />
)

// this is render the radio button
const radioButton = ({ input,label,mainLableName, ...rest }) => (
  <FormControl>
    <FormLabel component="legend">{mainLableName}</FormLabel>
    <RadioGroup {...input} {...rest}>
      {(label && label.length > 0) && label.map((item ,key)=> <FormControlLabel key={key} value={item} control={<Radio />} label={item} />)}
    </RadioGroup>
  </FormControl>
)
  
// this is the render the form helper
const renderFromHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>
  }
}

// this is the render selected filed
const renderSelectField = ({ input, label, style, meta: { touched, error }, children, ...custom }) => (
  <FormControl error={touched && error} style={style}>
    <InputLabel htmlFor="age-native-simple">{label}</InputLabel>
    <Select  native {...input} {...custom}  inputProps={{ name: label, }} > {children} </Select>
    {renderFromHelper({ touched, error })}
  </FormControl>
)

// this render date time picker filed
const renderDateTimePicker = ({ label,name,helperText, input, meta: { touched, invalid, error }, ...custom }) => 
  <TextField
    id={name}
    label={label}
    type="date"
    defaultValue=""
    error={touched && invalid}
    helperText={(touched && error) ? error : helperText }
    {...input}
    {...custom}
    InputLabelProps={{ shrink: true }}
  />

// this render autocompelete 
const renderAutocomplete=({label,name,optionData,className, input, meta: { touched, invalid, error }, ...custom})=>
  <Autocomplete
    id={name}
    autoHighlight
    options={(optionData && optionData.length >0) ? optionData: []}
    getOptionLabel={optionData => (optionData && optionData.title) && optionData.title}
    getOptionSelected={(option, value) => option.id === value.id}
    onChange={(event, value) => value && input.onChange(value.title)}
    renderInput={(params) => ( <TextField {...params} label={label} margin="normal"  /> )}
    {...custom}
  />

// this render autocompelete 
const renderAutocompleteByName=({label,name,optionData,className, input, meta: { touched, invalid, error }, ...custom})=>
  <Autocomplete
    id={name}
    autoHighlight
    options={(optionData && optionData.length >0) ? optionData: []}
    getOptionLabel={optionData => (optionData && optionData.name) && optionData.name}
    getOptionSelected={(option, value) => option.id === value.id}
    onChange={(event, value) => value && input.onChange(value.name)}
    renderInput={(params) => ( <TextField {...params} error={(touched && invalid) || error} helperText={error && error} label={label} margin="normal"  /> )}
    {...custom}
  />

// this render autocompelete 
const renderAutocompleteWithProps=({label,name,optionData,className, input, meta: { touched, invalid, error }, ...custom})=>
  <Autocomplete
    id={name}
    key={name}
    autoHighlight
    options={(optionData && optionData.length >0) ? optionData: []}
    getOptionLabel={optionData => (optionData && optionData.title) && optionData.title}
    getOptionSelected={(option, value) => option.id === value.id}
    onChange={(event, value) => value && input.onChange(value)}
    renderInput={(params) => ( <TextField {...params} label={label} margin="normal"  /> )}
    {...custom}
  />

// this will be render contact
const renderContact = ({ classes, open, handleClickOpen, handleClose, fields, initialValues, operation, meta: { error, submitFailed } }) => {
  return <span>
      { (operation !== FromActions.VI )&&<Button style={{ float: "Right" }} variant="contained" color="primary" onClick={()=>handleClickOpen(fields)}>ADD</Button>}
      <Dialog open={open} onClose={handleClose} classes={{ paper: classes.dialogPaper }} aria-describedby="alert-dialog-description" aria-labelledby="responsive-dialog-title" >
          <DialogTitle id="responsive-dialog-title-1">{"Add Contact"}</DialogTitle>
          <DialogContent>
              <DialogContentText>
                  {fields.map((member, index) => (
                      <tr key={index}>
                          <td><Field name={`${member}.name`} component={renderTextField} validate={(initialValues===undefined)&&[Required]} className={classes.textField} label="Name" helperText="Ex. admin" /></td>
                          <td><Field name={`${member}.email`} component={renderTextField} validate={(initialValues===undefined)&&[Required, Email]} className={classes.textField1} label="Email" helperText="Ex. admin@rigvedtech.com" /></td>
                          <td><Field name={`${member}.mobileNum`} component={renderTextField} validate={(initialValues===undefined)&&[Required, PhoneNumber]} className={classes.textField1} label="Mobile Number" helperText="Ex. 9130253456" /></td>
                          <td><Field name={`${member}.role`} component={renderTextField} className={classes.textField1} label="Job Designation" helperText="Ex. Developer" /></td>
                          <td><DeleteOutlineIcon variant="contained" color="secondary" onClick={() => fields.remove(index)} /></td>
                      </tr>
                  ))}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>Cancel</Button>
              <Button onClick={handleClose} color="secondary" autoFocus>Save</Button>
          </DialogActions>
      </Dialog>
  </span>
}

// this will used for the loading icons show
const renderLoading=({message , size})=>{
  return <center> <h3>{message}</h3> <CircularProgress size={size} /> </center>
}

// this method will used for the download the invoice table as pdf
const dwonloadInvoice = () => {
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

// this will used render matrial checkbox 
const renderMatiralCheckbox = props => (
  <CheckBox label={props.label}
    checked={props.value ? true : false}
    onCheck={props.onChange}/>
)

// render sankbar with alert
const renderSanckbarAlert=(props)=>{
  const { message, color }=props
  return <Snackbar open={message !== ""} autoHideDuration={1500} anchorOrigin= {{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={color}> {message} </Alert>
    </Snackbar>
}

export{
    renderTextField,
    renderTextHiddenField,
    renderCheckbox,
    renderSelectField,
    radioButton,
    renderDateTimePicker,
    renderNumberField,
    renderTextAreaField,
    renderFileInput,
    renderAutocomplete,
    renderAutocompleteByName,
    renderAutocompleteWithProps,
    renderPasswordTextField,
    renderContact,
    renderLoading,
    dwonloadInvoice,
    renderMatiralCheckbox,
    renderSanckbarAlert
}