import React from 'react';
import { connect } from 'react-redux';
import MaterialTable from "material-table";
import { Button } from '@material-ui/core';
import { FromActions } from '../../assets/config/Config';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DescriptionIcon from '@material-ui/icons/Description';
import moment from 'moment';
import { CheckBox, CheckBoxOutlineBlankOutlined } from '@material-ui/icons';

const InvoiceTable=(props)=>{
    const { fromAction, makeInvoicePayment }=props
    const { invoiceList }=props.InvoiceState
    // creating columns
    const columns = [
      { title: 'Sr.\u00a0No.', field: 'key', width: 5 },
      { title: 'Invoice\u00a0Date', field: 'invoiceDate',width: 10 },
      { title: 'Invoice\u00a0Number', field: 'invoiceNo', width:10 },
      { title: 'Client', field: 'toCompanyName'},
      // { title: 'Person\u00a0Responsible', field: 'managerName' },
      { title: 'Due\u00a0Date', field: 'dueDate', width: 10 },
      { title: 'Total\u00a0Amount\u00a0(INR)', field: 'billWitGST', width: 10 },
      {
        title: "",
        width:8,
        render: (rowData)=> {
          return<VisibilityIcon variant="contained" color="primary" onClick={()=>fromAction(rowData.data,FromActions.VI)} />
        }
      },
      {
        title: "",
        width:8,
        render: (rowData)=> {
          return<DescriptionIcon variant="contained" color="primary" onClick={()=>fromAction(rowData.data, FromActions.VIED)} />
        }
      },
      {
        title: "",
        width:8,
        render: (rowData)=> {
          const { paid }=rowData
          return (paid && paid==="PAID") ? <CheckBox variant="contained" color="primary" />:<CheckBoxOutlineBlankOutlined  variant="contained" color="secondary" onClick={()=>makeInvoicePayment(rowData.data)} />;
        }
      }
    ];

  // Creating rows
  const data = (invoiceList && invoiceList.length > 0) && invoiceList.map((item, key) => {
    return {...item,"key": (key + 1), "data": item, "invoiceDate": item.invoiceDate && moment(item.invoiceDate).format('YYYY-MM-DD'), "dueDate":item.invoiceDueDate && moment(item.invoiceDueDate).format('YYYY-MM-DD'), "billWitGST":item.billWitGST && Math.round(item.billWitGST) }
  });

  return <div style={{ maxWidth: "100%" }}>
    <MaterialTable
      title="Invoice Managment"
      columns={columns}
      data={(data && data.length > 0) ? data : []}
      options={{
        headerStyle: { backgroundColor: '#01579b', color: '#FFF' }
      }}
      actions={[
        { icon: () => <div><Button variant="contained" color="primary">Create Invoice</Button></div>,
          onClick: (event, rowData) => { fromAction(null, FromActions.CR); },
          isFreeAction: true,
          tooltip: 'Create Invoice'
        }
      ]}
    />
  </div>
}

const mapStateToProps = state => { return state; };
export default connect(mapStateToProps)(InvoiceTable);