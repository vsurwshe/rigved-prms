import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MaterialTable from 'material-table';
import { FromActions } from '../../assets/config/Config';
import { TableHeaderText } from '../../assets/config/TextConfig';

const  ClientTable=(props)=>{
  const {listOfClient}= props.ClientState
  const {viewClientDetails, deleteClientDetails, createClient}= props
  // creating columns
  const columns = [
    { title: 'Sr.\u00a0No.', field:'key', width: 20 },
    { title: 'Name',field:'name'},
    { title: 'GST\u00a0Number',field:'GST', width :30},
    { title: 'TAN\u00a0Number', field:'TAN', width: 60},
    {
      title: "",
      width:8,
      render: (rowData)=> {
          return<VisibilityIcon variant="contained" color="primary" onClick={()=>viewClientDetails(rowData.data,FromActions.VI)} />
      }
    },
    {
      title: "",
      width:8,
      render: (rowData)=> {
          return<CreateIcon variant="contained" color="primary" onClick={()=>viewClientDetails(rowData.data,FromActions.ED)} />
      }
    },
    {
      title: "",
      width:8,
      render: (rowData)=> {
          return <DeleteOutlineIcon variant="contained" color="secondary" onClick={()=>deleteClientDetails(rowData.data)} />
      }
    }  
  ];

  // Creating rows
  const data=(listOfClient && listOfClient.length >0 )&& listOfClient.map((item,key)=>{ 
    return { "key":(key+1), "data":item, "name":item.clientName, "GST":item.gstNum, "TAN":item.tanNum }
  });  
 
  return <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title={TableHeaderText.CLIENTTABLE}
      columns={columns}
      data={data.length >0 ? data :[]}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' }
      }}
      actions={[
        {icon: () =><div><Button variant="contained" color="primary">Create Client</Button></div>,
          onClick: (event, rowData) => { createClient(null,FromActions.CR); },
          isFreeAction: true,
          tooltip: 'Create Client'}
      ]}
    />
  </div>
}
const mapStateToProps = state => { return state; };
export default connect(mapStateToProps)(ClientTable);