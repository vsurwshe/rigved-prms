import React, { useState, forwardRef } from 'react';
import { Dialog, Button, Slide, DialogTitle, DialogActions, makeStyles, DialogContent, Grid, CircularProgress, RadioGroup } from '@material-ui/core';
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
import ResourceRateCardTable from "./ResourceRateCardTable";
import { loadMessage } from "../../redux/actions/ClientAction";
import moment from 'moment';
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';


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
  const { projectId } = props
  const { clientId } = (props.form && props.form.ProjectForm && props.form.ProjectForm.values) ? props.form.ProjectForm.values : ""
  const { GetEmployeeListByProjectId, EditEmployeeRecord, DeleteEmployeeRecord } = props.EmployeeAction
  const { GetClientDetailsById } = props.ClientAction
  const { operation } = props.stateData
  const { authorization } = props.LoginState
  const { clientDataById } = props.ClientState
  const { employeeListByPojectId } = props.EmpolyeeState
  const [open, setOpen] = useState(false);
  const [countCall, setCountCall] = useState(0)
  const [countCallRateCard, setCountRateCardCall] = useState(0)
  const handleClickOpen = () => { setOpen(true) };
  const handleClose = () => { setOpen(false) };

  const getEmployeeListProjectId = async () => {
    await setCountCall(countCall + 1)
    await GetEmployeeListByProjectId(0, 20, projectId, authorization);
    await loadMessage();
    exitsEmployeeListByPojectId = await (employeeListByPojectId && employeeListByPojectId.length > 0) && employeeListByPojectId.filter(item => item.projectId === projectId);
  }

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
    { title: 'Employee\u00a0Id', field: 'employeeNumber', width: 15, editable: "never" },
    { title: 'Name', field: 'name', editable: "never" },
    { title: 'Domain', field: 'domain', editable: "never" },
    { title: 'Category', field: 'category', editable: "never" },
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
        "domain": subitem.domain,
        "employeeNumber": subitem.employeeNumber,
        "name": subitem.firstName + " " + subitem.lastName,
        "category": subitem.category,
        "experience": subitem.fromExperience + "-" + subitem.toExperience,
        "skill": subitem.skill,
        "onbordaingDate": subitem.onbordaingDate && moment(subitem.onbordaingDate).format('YYYY-MM-DD'),
        "exitDate": subitem.exitDate && moment(subitem.exitDate).format('YYYY-MM-DD')
      }
    })
    return (tempData && tempData.length > 0) ? tempData : [];
  });


  return <> 
  {LoadAddResourceModel({ open, handleClose, "mainProps": props })}
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        title=""
        columns={columns}
        data={(data && data.length > 0) ? data[0] : []}
        options={{
          headerStyle: { backgroundColor: '#01579b', color: '#FFF' },
          search: false,
          actionsColumnIndex: -1
        }}
        actions={[
          {
            icon: () => { return (operation && (operation === FromActions.ED || operation === FromActions.VIED)) ? <div><Button variant="contained" color="primary">Assign Resource</Button></div> : "" },
            onClick: (event, rowData) => { handleClickOpen() },
            isFreeAction: true,
            tooltip: 'Assign Resource'
          }
        ]}
        icons={{
          Edit: () => { return <CreateIcon variant="contained" color="primary" /> },
          Delete: () => { return <DeleteOutlineIcon variant="contained" color="secondary" /> }
        }}
        editable={{
          isEditable: rowData => true,
          isEditHidden: rowData => false,
          isDeletable: rowData => true,
          isDeleteHidden: rowData => false,
          onRowUpdate: (newData, oldData) => {
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
              } else {
                reject();
              }
            })
          },
          onRowDelete: oldData => {
            return new Promise(async (resolve, reject) => {
              (oldData && oldData.emploeeMappedId) && await DeleteEmployeeRecord(oldData.emploeeMappedId, authorization);
              setTimeout(async () => {
                await GetEmployeeListByProjectId(0, 20, projectId, authorization)
                resolve();
              }, API_EXE_TIME)
            })
          }
        }}
      />
    </div>
  </>
}

// this method will used for the loading add resource model
const LoadAddResourceModel = (data) => {
  const classes = useStyles();
  const { open, handleClose } = data
  const [listOfEmployeeAccount, setEmployeeAccount] = useState([]);
  const [selectedRateCard, setSelectedRateCard] = useState({});
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);
  const { common_message }= data.mainProps.ClientState
  return <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
    <AppBar className={classes.appBar} style={{ float: "right" }}>
      <Toolbar >
        <IconButton classes={{ paper: classes.profileMenu }} color="inherit" onClick={handleClose} aria-label="close"> <CloseIcon /> </IconButton>
        <DialogTitle>Adding Resources</DialogTitle>
      </Toolbar>
    </AppBar>
    <DialogContent>
      {common_message && alert(common_message)}
      {load ? loadingCircle() : <>
        <Grid container spacing={3}>
          <Grid item xs={7}>
            {LoadRateCardList({ "mainProps": data.mainProps, selectedRateCard, setSelectedRateCard })}
          </Grid>
          <Grid item xs={5}>
            {(selectedRateCard && selectedRateCard.domainName) && LoadEmployeeList({ "mainProps": data.mainProps, listOfEmployeeAccount, setEmployeeAccount, tableData, setTableData, selectedRateCard })}
          </Grid>
        </Grid>
      </>
      }
    </DialogContent>
    <DialogActions>
      <Button onClick={() => { handleClose(); setSelectedRateCard({}); setTableData([]) }} color="primary">Cancel</Button>
      <Button onClick={() => loadAssignResource({ listOfEmployeeAccount, selectedRateCard, "mainProps": data.mainProps, load, setLoad, handleClose, tableData, setTableData, setSelectedRateCard })} color="secondary">Assign Resource</Button>
    </DialogActions>
  </Dialog>
}

// this method will used for the loading assign resource
const loadAssignResource = (data) => {
  console.log("LR ",data.mainProps)
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


// this method will used for the loading circule progress bar
const loadingCircle = () => <center> Saving.... <CircularProgress size={40} /> </center>

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

const EmployeeTable = (propsData) => {
  const { options, tableData, setTableData, selectedRateCard, headerText } = propsData;
  const columns = [
    {
      title: 'Member',
      field: 'account',
      editComponent: props => {
        return <Autocomplete
          id="accountId"
          autoHighlight
          options={(options && options.length > 0) ? options : []}
          getOptionSelected={(options, value) => options.id === value.id}
          getOptionLabel={options => (options && options.title) && options.title}
          onChange={(event, value) => value && props.onChange(value.id)}
          renderInput={(params) => (<TextField {...params} label="Member Name" margin="normal" />)}
        />
      }
    },
    {
      title: 'Onbordaing Date',
      field: 'onbordaingDate',
      editComponent: props => { return renderTextField({ name: "onbordaingDate", label: "Onbordaing Date", type: "date", action: { props } }) }
    }
  ]
  return <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title={headerText}
      columns={columns}
      data={(tableData && tableData.length > 0) ? tableData : []}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' },
        search: false,
        actionsColumnIndex: -1
      }}
      icons={{ Add: () => <Button variant="contained" color="primary">Add Member</Button> }}
      editable={{
        isEditable: rowData => false,
        isEditHidden: rowData => true,
        isDeletable: rowData => false,
        isDeleteHidden: rowData => true,
        onRowAdd: newData => {
          return new Promise(async (resolve, reject) => {
            let nameUser = options.filter((item) => item.id === newData.account)
            if(selectedRateCard && newData){
              const newUserTableData = {
                ...newData,
                "accountId": newData.account,
                "account": (nameUser && nameUser.length > 0) && nameUser[0].title,
                "rateCardId": selectedRateCard.rateCardId,
                "exitDate": null
              }
              setTableData([...tableData, newUserTableData])
              setTimeout(async()=>{resolve()}, API_EXE_TIME)
            }else{
              alert("Please check the provided fileds");
              reject();
            }
          })
        },
        onRowUpdate: (newData, oldData) => { },
        onRowDelete: oldData => { }
      }}
    />
  </div>
}

// this method will used for the rate card list into material table
const LoadRateCardList = (propsData) => {
  const { rateCardDtos } = (propsData && propsData.mainProps.ClientState && propsData.mainProps.ClientState.clientDataById) && propsData.mainProps.ClientState.clientDataById
  const { selectedRateCard, setSelectedRateCard } = propsData
  return <>
    {rateCardDtos ? 
    <RadioGroup aria-label="rateCard" name="rateCard" value={selectedRateCard && selectedRateCard.rateCardId }>
      <ResourceRateCardTable headerText="Select Rate Card" tableData={rateCardDtos} selectedRateCard={selectedRateCard} setSelectedRateCard={setSelectedRateCard} />
    </RadioGroup>
      : <h4>There is no rate card assign for this client</h4>}
  </>
}

const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  EmployeeAction: bindActionCreators(EmployeeAction, dispatch),
  ClientAction: bindActionCreators(ClientAction, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(ResourcesTable);