import React from 'react';
import { TextField, Button, FormControl, Select, InputLabel } from '@material-ui/core';
import MaterialTable from 'material-table';
import { API_EXE_TIME, FromActions } from '../../assets/config/Config';
import CreateIcon from '@material-ui/icons/Create';
import { Autocomplete } from '@material-ui/lab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

// this is main component
const RateCardTable = (propsData) => {
  const { rateCardDtos,setRateCardDtos, Domains, SkillCategory, SkillSet, rateOptions, operation }=propsData
  const columns =[
      {   title: "Domain", 
          field: "domainName",
          editComponent :props =>{
              return renderAutoComplete({ id:"domainName", lable:"Domain", props, optionData:Domains })
          }
      },
      {   title: "Category", 
          field: "skillCategory",
          editComponent :props =>{
              return renderAutoComplete({ id:"skillCategory", lable:"Category", props, optionData:SkillCategory })
          }
      },
      {   title: "Skill", 
          field: "skillSet",
          editComponent :props =>{
              return renderAutoComplete({ id:"skillSet", lable:"Skill", props, optionData:SkillSet }) 
          }
      },
      {   title: "Rate\u00a0Options", 
          field: "rateCardType",
          editComponent :props =>{
              return renderAutoComplete({ id:"rateCardType", lable:"Rate Options", props, optionData:rateOptions ,helperText:"Rate optons is required" })
          }
      },
      {   title: "Rate\u00a0Duration", 
          field: "rateCardDuration",
          editComponent :props =>{
            const { rateCardType }=props.rowData
            return renderTextField({ name:"duration", label:"Rate Duration", action:{props}, errorText:"Rate duration is required", disabled:(rateCardType &&rateCardType ==="Daily") ? true: false })
          }
      },
      {   title: "Form\u00a0Year", 
          field: "fromYearOfExp",
          editComponent :props =>{ return renderSelect({props, label:"Form Year"}) }
      },
      {   title: "To\u00a0Year", 
          field: "toYearOfExp",
          editComponent :props =>{ return renderSelect({props, label:"To Year"})}
      },
      {   title: "Rate", 
          field: "rate",
          editComponent :props =>{
            return renderTextField({ name:"rate", label:"Rate", action:{props}, errorText:" Rate is required"})
          }
      }
  ]
  return  <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title=""
      columns={columns}
      data={(rateCardDtos && rateCardDtos.length > 0) ? rateCardDtos : []}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' },
        search: false,
        actionsColumnIndex: -1
      }}
      icons={{
        Add: () => { return (operation !== FromActions.VI) && <Button variant="contained" color="primary">Add Rate Card</Button>},
        Edit:() => { return (operation !== FromActions.VI) &&<CreateIcon variant="contained" color="primary" /> },
        Delete: () => {return (operation !== FromActions.VI) &&<DeleteOutlineIcon variant="contained" color="secondary" />}
      }}
      editable={{
        isEditable: rowData => true, 
        isDeletable: rowData => false,
        isDeleteHidden: rowData => true,
        onRowAdd: newData =>onRateCardTabelAddRow({newData, setRateCardDtos, rateCardDtos}),
        onRowUpdate: (newData, oldData) =>onRateCardTabelUpdateRow({newData,oldData,rateCardDtos, setRateCardDtos}),
        onRowDelete: oldData =>{ return new Promise(async(resolve, reject) => { resolve() }) }
      }}
    />
</div>
}

// this method will help to adding row on table
const onRateCardTabelAddRow=(propsData)=>{
  const { newData, setRateCardDtos, rateCardDtos }=propsData
  return new Promise(async(resolve, reject) => {
    if(newData){
      if(!newData.fromYearOfExp || !newData.toYearOfExp){
        !newData.fromYearOfExp && alert("Please select form year");
        !newData.toYearOfExp && alert("Please select to year");
        reject();
      }else if(newData.fromYearOfExp < newData.toYearOfExp){
        if(validate(newData)){
          alert("Please check below provided fileds");
          reject();
        }else{
          await setRateCardDtos([...rateCardDtos,newData]);
          setTimeout(async()=>{
              resolve();
          },API_EXE_TIME)
        }
      }else{
        alert("Form year value should be less than compare to year value");
        reject();
      }
    }else{
      reject();
    }
  })
}

// this method will help to update row on table
const onRateCardTabelUpdateRow=(propsData)=>{
  const {rateCardDtos, setRateCardDtos, newData, oldData}=propsData
  return new Promise(async(resolve, reject) => { 
    if(rateCardDtos && rateCardDtos.length >=0){
        let filterData = rateCardDtos.filter(item => item.id !== oldData.id);
        await setRateCardDtos([...filterData,newData]);
        resolve();
    }else{
      reject()
    }
  })
}

// this method will used for the validting form
const validate=(rowData)=>{
  if( rowData.domainName === undefined || 
      rowData.domainName === '' ||
      rowData.skillCategory === undefined || 
      rowData.skillCategory === '' ||
      rowData.skillSet === undefined || 
      rowData.skillSet === '' ||
      rowData.rateCardType === undefined ||
      rowData.rateCardType === '' ||
      (rowData.rateCardType !== "Daily" && rowData.rateCardDuration === undefined) ||
      (rowData.rateCardType !== "Daily" && rowData.rateCardDuration === '') ||
      rowData.rate === undefined ||
      rowData.rate === ''  
    ){
    return true;
  }else{
    return false;
  }
}

// this method will render auto complete
const renderAutoComplete=(propsData)=>{
  const { id, optionData, props, lable, setOpen, helperText }= propsData
  return <Autocomplete
  id={id}
  style={{marginTop:"-10px"}}
  autoHighlight
  options={(optionData && optionData.length >0) ? optionData: []}
  getOptionLabel={option => option.name ? option.name :option}
  getOptionSelected={(option, value) => option.id === value.id}
  onChange={(event, value) =>{
      setOpen && setOpen(true);
      value && props.onChange(value.name)
  }}
  value={props.value}
  renderInput={(params) => ( <TextField {...params} error={!props.value} helperText={!props.value ? helperText:""} label={lable} margin="normal"  /> )}
/>
}

// this method will render the select options
const renderSelect=(propsData)=>{
  const { props ,label }=propsData
  return <FormControl error={props.touched && props.error} style={{width:"100%"}}>
  <InputLabel htmlFor="age-native-simple">{label}</InputLabel>
  <Select  native value={props.value} onChange={(event) => props.onChange(event.target.value)} >
      {[...Array(10)].map((item, key) => <option key={key} value={key}>{key}</option>)}
  </Select>
</FormControl>
}

// this is render text field
const renderTextField=({name, label, action, errorText,disabled})=>(
  <TextField
    id={name}
    label={label}
    value={action.props.value}
    onChange={(event) => action.props.onChange(event.target.value)}
    error={ disabled ? "": (!action.props.value)}
    helperText={ disabled ? "": ((!action.props.value) ? errorText:"")}
    disabled={disabled}
  />
)

export default RateCardTable;