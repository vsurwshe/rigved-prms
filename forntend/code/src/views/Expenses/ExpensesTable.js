import React,{useState} from 'react';
import { connect } from "react-redux";
import MaterialTable from "material-table";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button } from '@material-ui/core';
import { API_EXE_TIME, FromActions } from '../../assets/config/Config';
import * as ExpenseAction from "../../redux/actions/ExpensesAction";
import * as FileAction from "../../redux/actions/FileAction";
import { loadMessage } from "../../redux/actions/ClientAction";
import moment from 'moment';
import { bindActionCreators } from 'redux';
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

// this is main compoent
const ExpensesTable = (props) => {
  const { projectId }=props 
  const { operation }=props.stateData
  const [ countCall,setCountCall ]=useState(0)
  const { expensesListByProjectId}=props.ExpenseState
  const { GetExpensesListByProjectId, DeleteExpenseRecord } = props.ExpenseAction
  const { ExpenseTypeList }=props.MasterDataSet
  const { authorization }=props.LoginState
  let expenseTypeListOptions= ExpenseTypeList.length >0 && ExpenseTypeList.map((item,key)=>{return{title:item.name,id:item.id}})
  let exitsExpensesListByProjectId=(expensesListByProjectId && expensesListByProjectId.length > 0)&& expensesListByProjectId.filter(item=> item.projectId ===projectId);
  if((exitsExpensesListByProjectId === false || exitsExpensesListByProjectId.length <=0) && countCall===0){
      getExpenseListByProjectId({setCountCall,countCall, GetExpensesListByProjectId, projectId, authorization, exitsExpensesListByProjectId, expensesListByProjectId});
  }

  // creating columns
  const columns = [
    { title:"", field:"id", hidden:true},
    { title:"", field:"attachmentUrl1", hidden:true},
    { title: 'Expense\u00a0Type', 
      field: 'expType', 
      editable:"onAdd",
      editComponent: props => {
        return <Autocomplete
          id="exp-type"
          autoHighlight
          options={(expenseTypeListOptions && expenseTypeListOptions.length >0) ? expenseTypeListOptions: []}
          getOptionLabel={(expenseTypeListOptions) => expenseTypeListOptions.title ? expenseTypeListOptions.title : ""}
          getOptionSelected={(expenseTypeListOptions, value) => expenseTypeListOptions.id === value.id}
          onChange={(event, value) => value && props.onChange(value.id)}
          renderInput={(params) => ( <TextField {...params} error={!props.value} label="Expense Type" margin="normal"  /> )}
        /> 
      },
    },
    { title: 'Description',
      field: 'description',
      editComponent: props=>{
        return renderTextFiled({ name:"description", label:"Description", type:"text", action:{props}, show:true})
      },
    },
    { title: 'Amount', 
      field: 'amount',
      editComponent: props=>{
        return renderTextFiled({ name:"amount", label:"Amount", type:"number", action:{props}, show:true})
      },
    },
    { title: 'Date', 
      field: 'expDate',
      editComponent: props=>{
        return renderTextFiled({ name:"expDate", label:"Expense Date", type:"date", action:{props}, show:true})
      },
      render:rowData=>{
        const {expDate}=rowData
        return expDate ? moment(expDate).format('YYYY-MM-DD') :""
      }
    },
    { title: "Attatchment",
      field:'attachmentUrl',
      editable:"onAdd",
      editComponent: dataProps=>{
      return (props.FileState && props.FileState.fileUrl && props.FileState.fileUrl.length > 0 ) ?<h5>{loadFileUrlName(props.FileState.fileUrl[0])}</h5> 
            :<TextField 
                type="file"
                onChange={event => ExpenseFileUpload(event,props)}
                InputLabelProps={{ shrink: true }}/> 
      }
    },
  ];

  // Creating rows
  let data =(exitsExpensesListByProjectId && exitsExpensesListByProjectId.length > 0 ) && exitsExpensesListByProjectId.map((item, key) => {
    let tempData=(item && item.List.length>0) && item.List.map((subitem,key)=>{
      return  { 
        ...subitem,
        "data": subitem, 
        "id":subitem.id,
        "attachmentUrl1":subitem.attachmentUrl,
        "expType":subitem.expType && subitem.expType.name, 
        "attachmentUrl":loadFileUrlName(subitem.attachmentUrl)
      }
    }) 
    return (tempData && tempData.length >0 )? tempData : [];
  });

  return <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title=""
      columns={columns}
      data={(data && data.length > 0) ? data[0] : []}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' },
        search: false,
        actionsColumnIndex: -1
      }}
      icons={{
        Add: () => { return (operation && (operation === FromActions.ED || operation === FromActions.VIED)) ? <Button variant="contained" color="primary">Add Expense</Button> : ""},
        Edit:() => { return (operation && operation !== FromActions.VI) && <CreateIcon variant="contained" color="primary" /> },
        Delete: () => {return (operation && operation !== FromActions.VI) && <DeleteOutlineIcon variant="contained" color="secondary" />}
      }}
      editable={{
        isEditable: rowData => true, 
        isDeletable: rowData => true,
        onRowAdd: newData =>onExpenseTableAddRow({ newData, projectId, props}),
        onRowUpdate: (newData, oldData) =>onExpenseTableUpdateRow({expenseTypeListOptions, newData, projectId, props}),
        onRowDelete: oldData =>onExpenseTableDeleteRow({oldData,DeleteExpenseRecord, GetExpensesListByProjectId, projectId, authorization})
      }}
    />
  </div>
}

// this method will help to add row in expense table
const onExpenseTableAddRow=(propsData)=>{
  const { newData, projectId, props }=propsData
  return new Promise(async(resolve, reject) => {
    if(validate(newData)){
      alert("Please check your provided fields data");
      reject();
    }else{
      let newExpenseData={
        ...newData,
        "active":true,
        "project":{ "id":projectId },
        "expType":{ "id":newData.expType},
        "attachmentUrl":  (props.FileState && props.FileState.fileUrl && props.FileState.fileUrl.length > 0 ) ? props.FileState.fileUrl[0] :""
      }
      callSaveExpenseRecord({ mainProps: props, resolve, projectId , newData:[newExpenseData]})
    }
  })
}

// this method will help to update row in exepnse table
const onExpenseTableUpdateRow=(propsData)=>{
  const { expenseTypeListOptions, newData, projectId, props}=propsData
  return new Promise(async(resolve, reject) => {
    let filterExpenseOptions=expenseTypeListOptions && expenseTypeListOptions.filter(item=>item.title === newData.expType);
    let newExpenseData={
      "id":newData.id,
      "expDate":newData.expDate,
      "attachmentUrl":newData.attachmentUrl1,
      "amount":newData.amount,
      "description":newData.description,
      "active": true,
      "project": { "id": projectId},
      "expType": { "id": (filterExpenseOptions && filterExpenseOptions.length >0) && filterExpenseOptions[0].id }
    } 
    callSaveExpenseRecord({ mainProps: props, resolve, projectId , newData:[newExpenseData],method:"update"})
  })
}

// this method will help to delete row in expense table
const onExpenseTableDeleteRow=(propsData)=>{
  const { oldData, DeleteExpenseRecord, GetExpensesListByProjectId, projectId, authorization }=propsData
  return new Promise(async(resolve, reject) => {
    (oldData && oldData.id) && await DeleteExpenseRecord(oldData.id, authorization);
     setTimeout(async()=>{
       await GetExpensesListByProjectId(0,20,projectId, authorization)
       resolve();
     },API_EXE_TIME)
   })
}
// this method will used for save expense recrod
const callSaveExpenseRecord=async(props)=>{
  const { resolve, newData, projectId, method }=props
  const { SaveFileData }= props.mainProps.FileAction
  const { authorization }=props.mainProps.LoginState
  const { SaveExpenseRecord, GetExpensesListByProjectId } = props.mainProps.ExpenseAction
  await SaveExpenseRecord(newData,authorization);
  setTimeout(async()=>{
    (method === "" && method !=="update")&&await SaveFileData();
    await GetExpensesListByProjectId(0,20,projectId, authorization)
    resolve();
  },API_EXE_TIME)
}

// this method will help get expense list by project id
const getExpenseListByProjectId=async({setCountCall,countCall, GetExpensesListByProjectId, projectId, authorization, exitsExpensesListByProjectId, expensesListByProjectId})=>{
  await setCountCall(countCall + 1)
  await GetExpensesListByProjectId(0,20,projectId,authorization);
  await loadMessage();   
  exitsExpensesListByProjectId= await (expensesListByProjectId && expensesListByProjectId.length > 0)&& expensesListByProjectId.filter(item=> item.projectId ===projectId);
}

// this method will help to load fileurl
const loadFileUrlName=(fileUrl)=>{
  let fileArray=fileUrl && fileUrl.split("\\");
  return fileArray && fileArray.length > 0 ? fileArray[5]: "";
}

// this method will help to upload expense file
const ExpenseFileUpload=async (event,props)=>{
  let imageFile = event.target.files[0];
  if (imageFile) {
    var reader = new FileReader();
    reader.onload =async()=>{
      let byteArray=reader.result.split(",")
      let fileArray=imageFile.name.split(".");
      let fileName=(fileArray && fileArray.length >0) &&  fileArray[0];
      CallFileUpload(byteArray.length >0 && byteArray[1],fileName,imageFile.type, props)
    };
    reader.onerror = function (error) { console.log('Error: ', error); };
    await reader.readAsDataURL(imageFile);
  }
}

// this method will used for upload 
const CallFileUpload=async(fileData,fileName,fileType, props)=>{
  const { dispatch }=props
  const { SaveFileDetails }= props.FileAction
  const { authorization } = props.LoginState
  let newFileData=[{
    "fileName":fileName,
    "description":"ExpenseDetail",
    "contentType":"pdf",
    "content":`${fileData}`
  }]
   await SaveFileDetails (newFileData, authorization)
   await dispatch(loadMessage());
   return '';
}

// this method will used for validting expense form
const validate=(rowData)=>{
  if( rowData.expType === undefined || 
      rowData.expType === '' ||
      rowData.description === undefined || 
      rowData.description === '' ||
      rowData.description === undefined || 
      rowData.amount === '' ||
      rowData.expDate === undefined ||
      rowData.expDate === ''  
    ){
    return true;
  }else{
    return false;
  }
}

// this is render the text fileds in tabel
const renderTextFiled=({name, label, type, action, show })=>(
  <TextField
      id={name}
      label={label}
      type={type}
      value={ show ? action.props.value : ""}
      onChange={e => action.props.onChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      required={true}
      error={!action.props.value}
  />
)

const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  ExpenseAction: bindActionCreators(ExpenseAction, dispatch),
  FileAction : bindActionCreators(FileAction,dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
