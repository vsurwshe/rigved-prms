import React from 'react';
import { connect } from "react-redux";
import MaterialTable from "material-table";
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';
import { FromActions } from '../../assets/config/Config';
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';


const ProjectTable = (props) => {
  const { projectList } = props.ProjectState
  const { fromAction, deleteMethod } = props

  // creating columns
  const columns = [
    { title: 'Sr.\u00a0No.', field: 'key', width: 20 },
    { title: 'Project\u00a0Name', field: 'projectName' },
    { title: 'Client\u00a0Name', field: 'clientName' },
    { title: 'Resources', field: 'resource', width: 30 },
    {
      title: "PO\u00a0Recieved",
      width: 8,
      render: (rowData) => {
        return <Checkbox onChange={() => console.log("Checkbox Clicked")} name="jason" />
      }
    },
    { title: 'Status', field: 'status', width: 60 },
    {
      title: "",
      width:8,
      render: (rowData)=> {
          return<VisibilityIcon variant="contained" color="primary" onClick={()=>fromAction(rowData.data,FromActions.VI,true)} />
      }
    },
    {
      title: "",
      width:8,
      render: (rowData)=> {
          return<CreateIcon variant="contained" color="primary" onClick={()=>fromAction(rowData.data,FromActions.ED,true)} />
      }
    },
    {
      title: "",
      width:8,
      render: (rowData)=> {
          return <DeleteOutlineIcon variant="contained" color="secondary" onClick={()=>deleteMethod(rowData.data)} />
      }
    }  
  ];

  // Creating rows
  const data = (projectList && projectList.length > 0) && projectList.map((item, key) => {
    return { "key": (key + 1), "data": item, "projectName": item.projectName, "clientName": item.clientName }
  });

  return <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title="Project Managment"
      columns={columns}
      data={data.length > 0 ? data : []}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' }
      }}
      actions={[
        { icon: () => <div><Button variant="contained" color="primary">Create Project</Button></div>,
          onClick: (event, rowData) => { fromAction(null, FromActions.CR); },
          isFreeAction: true,
          tooltip: 'Create Project'
        }
      ]}
    />
  </div>
}

const mapStateToProps = state => { return state; };
export default connect(mapStateToProps)(ProjectTable);
