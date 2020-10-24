import React from 'react';
import { connect } from "react-redux";
import MaterialTable from "material-table";
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Button } from '@material-ui/core';
import { FromActions } from '../../assets/config/Config';
import { TableHeaderText } from '../../assets/config/TextConfig'

const PurchaseOrderTable=(props)=>{
    const { purchaseOrderList}=props.PurchaseOrderState
    const { createPurchaseOrder, viewPurchaseOrder, deletePuchaseOrder}=props 

      // creating columns
    const columns = [
        { title: 'Sr.\u00a0No.', field:'key', width: 20 },
        { title: 'PO\u00a0Number', field:'poNum' },
        { title: 'Amount',field:'poAmount'},
        { title: 'For Client',field:'clientName'},
        {
          title: "",
          width:8,
          render: (rowData)=> {
              return<VisibilityIcon variant="contained" color="primary" onClick={()=>viewPurchaseOrder(rowData.data,FromActions.VI)} />
          }
        },
        {
          title: "",
          width:8,
          render: (rowData)=> {
              return<CreateIcon variant="contained" color="primary" onClick={()=>viewPurchaseOrder(rowData.data,FromActions.ED)} />
          }
        },
        {
          title: "",
          width:8,
          render: (rowData)=> {
              return <DeleteOutlineIcon variant="contained" color="secondary" onClick={()=>deletePuchaseOrder(rowData.data)} />
          }
        }  
    ];

    // Creating rows
    const data=(purchaseOrderList && purchaseOrderList.length >0 )&& purchaseOrderList.map((item,key)=>{ 
      return { "key":(key+1), "data":item, "poAmount":item.poAmount, "poNum":item.poNum, "clientName":item.clientName }
    });

    return <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title={TableHeaderText.POTABLE}
      columns={columns}
      data={data.length > 0 ? data :[]}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' }
      }}
      actions={[
        {icon: () =><Button variant="contained" color="primary">Create PO</Button>,
          onClick: (event, rowData) => { createPurchaseOrder(null,FromActions.CR); },
          isFreeAction: true,
          tooltip: 'Create PO'}
      ]}
    />
  </div>

}

const mapStateToProps = state => { return state; };
export default connect(mapStateToProps)(PurchaseOrderTable);
