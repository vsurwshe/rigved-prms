import React, { useState, forwardRef } from 'react';
import { Dialog, Button, Slide, DialogTitle, DialogActions, makeStyles, DialogContent, Grid,  } from '@material-ui/core';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import * as EmployeeAction from "../../redux/actions/EmployeeAction";
import * as ClientAction from "../../redux/actions/ClientAction"
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FromActions, API_EXE_TIME } from '../../assets/config/Config';
import { bindActionCreators } from 'redux';
import { loadMessage } from "../../redux/actions/ClientAction";
import moment from 'moment';
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { renderLoading } from '../utilites/FromUtilites';
import { EmployeeTable, LoadRateCardList } from './EmployeeTabel';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  profileMenuIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.text.hint,
  }
}));

// this method will used for the transition for model 
const Transition = forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} />; });

let ResourcesTable = (props) => {
  const { projectId, disableResourceModel } = props
  const { clientId } = (props.form && props.form.ProjectForm && props.form.ProjectForm.values) ? props.form.ProjectForm.values : ""
  const { GetEmployeeListByProjectId } = props.EmployeeAction
  const { GetClientDetailsById } = props.ClientAction
  const { operation } = props.stateData
  const { EmployeeList } = props.MasterDataSet
  const { authorization } = props.LoginState
  const { employeeListByPojectId } = props.EmpolyeeState
  const [open, setOpen] = useState(false);
  const [countCall, setCountCall] = useState(0)
  const [countCallRateCard, setCountRateCardCall] = useState(0)
  const handleClickOpen = () => { setOpen(true) };
  const handleClose = () => { setOpen(false) };
  let optionsEmployee = EmployeeList.length > 0 && EmployeeList.map((item, key) => { return { title: item.firstName + " " + item.lastName, id: item.accountId, empId:item.employeeNumber } });
  const getEmployeeListProjectId = async () => {
    await setCountCall(countCall + 1)
    await GetEmployeeListByProjectId(0, 20, projectId, authorization);
    await loadMessage();
    exitsEmployeeListByPojectId = await (employeeListByPojectId && employeeListByPojectId.length > 0) && employeeListByPojectId.filter(item => item.projectId === projectId);
  }

  // this variable checking empolyeeList with projectId
  let exitsEmployeeListByPojectId = (employeeListByPojectId && employeeListByPojectId.length > 0) && employeeListByPojectId.filter(item => item.projectId === projectId);

  // this codition will check the passed project id realted employee is there or not
  if ((exitsEmployeeListByPojectId === false || exitsEmployeeListByPojectId.length <= 0) && countCall === 0) {
    getEmployeeListProjectId();
  }

  // this codition get the client details by client id
  if (countCallRateCard === 0 && clientId) {
    setCountRateCardCall(countCallRateCard + 1);
    GetClientDetailsById(clientId, authorization)
    loadMessage();
  }

  // creating columns
  const columns = [
    { title: "", field: "accountId", hidden: true },
    { title: "", field: "emploeeMappedId", hidden: true },
    { title: "", field: "projectId", hidden: true },
    { title: 'Id', field: 'employeeNumber', width: 15, editable: "never" },
    { title: 'Name', 
      field: 'name', 
      editable: disableResourceModel ? "always" : "never", 
      editComponent: props => {
        return renderAutoComplete({name:"employeeName", label:"Select", optionData:optionsEmployee, propsData:props, onChange:(value)=>{
          var data = { ...props.rowData };
          data.employeeNumber = value ? value.empId :"";
          data.accountId = value ? value.id :"";
          data.name = value ? value.title :"";
          props.onRowDataChange(data);
        } })
      }
    },
    { title: 'Domain', field: 'domain', editable: "never" },
    // { title: 'Category', field: 'category', editable: "never" },
    { title: 'Experience', field: 'experience', editable: "never", width: 10 },
    { title: 'Skill', field: 'skill', editable: "never", width: 10 },
    {
      title: 'Onboarding\u00a0Date',
      width: 15,
      field: 'onbordaingDate',
      editComponent: props => {
        return renderTextField({ name: "onbordaingDate", label: "Onbordaing Date", type: "date", action: { props } })
      }
    },
    {
      title: 'Exit\u00a0Date',
      width: 15,
      field: 'exitDate',
      editComponent: props => {
        return renderTextField({ name: "exitDate", label: "Exit Date", type: "date", action: { props } })
      }
    }
  ];

  // Creating rows
  let data = (exitsEmployeeListByPojectId && exitsEmployeeListByPojectId.length > 0) && exitsEmployeeListByPojectId.map((item, key) => {
    let tempData = (item && item.List.length > 0) && item.List.map((subitem, key) => {
      return {
        "data": subitem,
        "projectId": projectId ? projectId : "",
        "accountId": (subitem && subitem.accountId) ? subitem.accountId : "",
        "emploeeMappedId": subitem.emploeeMappedId,
        "domain": subitem.domain && subitem.domain,
        "employeeNumber": subitem.employeeNumber,
        "name": subitem.firstName + " " + subitem.lastName,
        "category": subitem.category && subitem.category,
        "experience": subitem.fromExperience && subitem.fromExperience + "-" + subitem.toExperience,
        "skill": subitem.skill && subitem.skill,
        "onbordaingDate": subitem.onbordaingDate && moment(subitem.onbordaingDate).format('YYYY-MM-DD'),
        "exitDate": subitem.exitDate && moment(subitem.exitDate).format('YYYY-MM-DD')
      }
    })
    return (tempData && tempData.length > 0) ? tempData : [];
  });

  return <> 
  {!disableResourceModel && <LoadAddResourceModel open={open} handleClose={handleClose} mainProps={props }/>}
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        title="Resource Managment"
        columns={columns}
        data={(data && data.length > 0) ? data[0] : []}
        options={{
          headerStyle: { backgroundColor: '#01579b', color: '#FFF' },
          search: false,
          actionsColumnIndex: -1
        }}
        actions={[ {icon: () => LoadAddButtonAction({operation, disableResourceModel,handleClickOpen}), isFreeAction: true}]}
        icons={{
          Add: () => (disableResourceModel && operation && (operation === FromActions.ED || operation === FromActions.VIED)) ? <Button variant="contained" color="secondary">Add</Button> :"",
          Edit: () => { return (operation !== FromActions.VI) && <CreateIcon variant="contained" color="primary" /> },
          Delete: () => { return (operation !== FromActions.VI) && <DeleteOutlineIcon variant="contained" color="secondary" /> }
        }}
        editable={{
          isEditable: rowData => true,
          isDeletable: rowData => true,
          onRowAdd: newData => saveResourceTableRecord({newData,projectId,"mainProps":props}),
          onRowUpdate: (newData, oldData) => updateResourceTableRecord({newData, oldData, "mainProps":props}),
          onRowDelete: oldData => deleteReourceTableRecord({oldData, "mainProps":props, projectId})
        }}
      />
    </div>
  </>
}

// this method will called when you click on Save resource button
const saveResourceTableRecord=(props)=>{
  const {newData , projectId }=props
  const { authorization } = props.mainProps.LoginState
  const { SaveEmployeeRecord, GetEmployeeListByProjectId } = props.mainProps.EmployeeAction
  return new Promise(async (resolve, reject) => {
    if(newData){
      let modifyData={
        "active": 1,
        "employeeList": [{ ...newData, "rateCardId": "NA"}],
        "projectId": projectId
      }
      SaveEmployeeRecord(modifyData,authorization);
      setTimeout(async()=>{
        await GetEmployeeListByProjectId(0,100,projectId,authorization);
        await resolve();
      },API_EXE_TIME)
    }else{
      reject();
    }
  })
}

// this method will used when you updating exsting record in table
const updateResourceTableRecord=(props)=>{
  const { newData }=props
  const { clientDataById } = props.mainProps.ClientState
  const { authorization } = props.mainProps.LoginState
  const { GetEmployeeListByProjectId, EditEmployeeRecord } = props.mainProps.EmployeeAction
  return new Promise(async (resolve, reject) => {
    const { id } = (clientDataById && clientDataById.rateCardDtos && clientDataById.rateCardDtos.length > 0) ? clientDataById.rateCardDtos[0] : ""
    if (newData) {
      var onbordaingDate = new Date(newData.onbordaingDate);
      var exitDate = new Date(newData.exitDate);
      if (onbordaingDate < exitDate) {
        let resourceData = {
          "emploeeMappedId": newData && newData.emploeeMappedId,
          "accountId": newData && newData.accountId,
          "rateCardId": id && id,
          "onbordaingDate": newData && newData.onbordaingDate,
          "exitDate": newData && newData.exitDate
        }
        await EditEmployeeRecord(resourceData, authorization);
        setTimeout(async () => {
          await GetEmployeeListByProjectId(0, 20, newData.projectId, authorization);
          resolve();
        }, API_EXE_TIME)
      } else {
        alert("onborading date should be less than exit date");
        reject();
      }
    } else { reject(); }
  })
}

// this method will used for delete record form reource table
const deleteReourceTableRecord=(props)=>{
  const { oldData, projectId }=props
  const { authorization } = props.mainProps.LoginState
  const { GetEmployeeListByProjectId, DeleteEmployeeRecord } = props.mainProps.EmployeeAction
  return new Promise(async (resolve, reject) => {
    (oldData && oldData.emploeeMappedId) && await DeleteEmployeeRecord(oldData.emploeeMappedId, authorization);
    setTimeout(async () => {
      await GetEmployeeListByProjectId(0, 20, projectId, authorization)
      resolve();
    }, API_EXE_TIME)
  })
}

// this method will used for the loading action button top right side table
const LoadAddButtonAction=(props)=>{
  const { operation, disableResourceModel, handleClickOpen }=props
  if(operation && (operation === FromActions.ED || operation === FromActions.VIED)){
    if(disableResourceModel){
      return <div><Button variant="contained" color="primary">Save Resources</Button></div>
    }else{
      return <div><Button variant="contained" color="primary" onClick={()=>handleClickOpen()}>Assign Resource</Button></div>
    }
  } 
}

// this method will used for the loading add resource model
const LoadAddResourceModel = (propsData) => {
  const classes = useStyles();
  const { open, handleClose } = propsData
  const [listOfEmployeeAccount, setEmployeeAccount] = useState([]);
  const [selectedRateCard, setSelectedRateCard] = useState({});
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);
  const { common_message }= propsData.mainProps.ClientState
  return <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
    <AppBar className={classes.appBar} style={{ float: "right" }}>
      <Toolbar >
        <IconButton classes={{ paper: classes.profileMenu }} color="inherit" onClick={handleClose} aria-label="close"> <CloseIcon /> </IconButton>
        <DialogTitle>Adding Resources</DialogTitle>
      </Toolbar>
    </AppBar>
    <DialogContent>
      {(common_message && common_message !== "Something went worng..!") && alert(common_message)}
      {load ? renderLoading({message:"Saving....",size:"40"}) : <>
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <LoadRateCardList 
              mainProps={propsData.mainProps}
              selectedRateCard={selectedRateCard}
              setSelectedRateCard={setSelectedRateCard}
            />
          </Grid>
          <Grid item xs={5}>
            {(selectedRateCard && selectedRateCard.domainName) && LoadEmployeeList({ "mainProps": propsData.mainProps, listOfEmployeeAccount, setEmployeeAccount, tableData, setTableData, selectedRateCard })}
          </Grid>
        </Grid>
      </>
      }
    </DialogContent>
    <DialogActions>
      <Button onClick={() => { handleClose(); setSelectedRateCard({}); setTableData([]) }} color="primary">Cancel</Button>
      <Button onClick={() => loadAssignResource({ listOfEmployeeAccount, selectedRateCard, "mainProps": propsData.mainProps, load, setLoad, handleClose, tableData, setTableData, setSelectedRateCard })} color="secondary">Assign Resource</Button>
    </DialogActions>
  </Dialog>
}

// this method will used for the loading assign resource
const loadAssignResource = (data) => {
  const { setLoad, load, handleClose, tableData, setTableData, setSelectedRateCard } = data
  const { projectId, dispatch } = data.mainProps
  const { authorization } = data.mainProps.LoginState
  const { SaveEmployeeRecord, GetEmployeeListByProjectId } = data.mainProps.EmployeeAction
  let newResourceData = {
    "employeeList": tableData,
    "projectId": projectId,
    "active": 1
  }
  setLoad(true);
  saveAssignResource({ newResourceData, load, setLoad, SaveEmployeeRecord, GetEmployeeListByProjectId, authorization, handleClose, setTableData, setSelectedRateCard, dispatch });
}

// this method will used for calling the save employee record
const saveAssignResource = async (propsData) => {
  const { newResourceData, setLoad, SaveEmployeeRecord, GetEmployeeListByProjectId, authorization, handleClose, setTableData, setSelectedRateCard, dispatch } = propsData
  if (newResourceData) {
    await SaveEmployeeRecord(newResourceData, authorization);
    await dispatch(loadMessage());
    await GetEmployeeListByProjectId(0, 20, newResourceData.projectId, authorization);
    await setSelectedRateCard({});
    await setTableData([]);
    await setLoad(false);
    await handleClose();
  }
}

// this is render the text fileds in tables
const renderTextField = (props) => {
  const { name, label, type, action } = props
  return <TextField
    id={name}
    label={label}
    type={type}
    value={action.props.value}
    onChange={e => action.props.onChange(e.target.value)}
    InputLabelProps={{ shrink: true }}
    required={true}
  />
}

// this method will used for render autocomplete
const renderAutoComplete=(props)=>{
  const {name, optionData, propsData, label,helperText,onChange }=props
  return <Autocomplete
    id={name}
    style={{marginTop:"-10px"}}
    autoHighlight
    options={(optionData && optionData.length >0) ? optionData: []}
    getOptionLabel={option => option.title ? option.title :option}
    getOptionSelected={(option, value) => option.id === value.id}
    onChange={(event, value) =>{ value && onChange(value) }}
    renderInput={(params) => ( <TextField {...params} error={!propsData.value} helperText={!propsData.value ? helperText:""} InputLabelProps={{ shrink: true }} label={label} margin="normal"  /> )}
/>
}

// this method will used for the loading employee list
const LoadEmployeeList = (props) => {
  const { EmployeeList } = props.mainProps.MasterDataSet
  const { tableData, setTableData, selectedRateCard } = props
  let options = EmployeeList.length > 0 && EmployeeList.map((item, key) => { return { title: item.firstName + " " + item.lastName, id: item.accountId } });
  let employeeTableHeaderText= `Member for ${selectedRateCard ? selectedRateCard.domainName : ""} Rate Card`;
  return <EmployeeTable 
    options={options}
    tableData={tableData}
    setTableData={setTableData}
    selectedRateCard={selectedRateCard}
    headerText={employeeTableHeaderText}
  />
}


const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  EmployeeAction: bindActionCreators(EmployeeAction, dispatch),
  ClientAction: bindActionCreators(ClientAction, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(ResourcesTable);