import React, { Component } from 'react';
import InvoiceFrom from './InvoiceFrom';
import { connect } from 'react-redux';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import InvoiceTable from './InvoiceTable';
import * as ClientAction from "../../redux/actions/ClientAction";
import * as InvoiceAction from '../../redux/actions/InvoiceAction';
import { bindActionCreators } from 'redux';
import { API_EXE_TIME, FromActions } from '../../assets/config/Config';
import { dwonloadInvoice, renderLoading } from '../utilites/FromUtilites';
import Invoice from './Invoice';
class InvoiceManagement extends Component {
    state = {  
        loadInvoiceList:false,
        fromAction:false,
        operations:"",
        invoiceData:[],
        pdfInvoiceData:[],
        makePayInvoice:false
    };

    componentDidMount=async()=>{
        const { listOfClient }=this.props.ClientState
        const { invoiceList }=this.props.InvoiceState
        const { authorization }=this.props.LoginState
        const { GetClientList, loadMessage }=this.props.ClientAction
        const { getPDFInvoiceList }=this.props.InvoiceAction
        await this.handleInvoiceLoadvalue();
        (listOfClient && listOfClient<=0)&& await GetClientList(0,20,authorization);
        (invoiceList && invoiceList<=0)&& await getPDFInvoiceList(0,20,authorization);
        await loadMessage();
        await this.handleInvoiceLoadvalue();
    }

    handleMakePayInvoice=(invoiceData)=>{ this.setState({ invoiceData, makePayInvoice: !this.state.makePayInvoice})}
    
    // this method will handle the progress bar datas
    handleInvoiceLoadvalue=()=>{ this.setState({loadInvoiceList: !this.state.loadInvoiceList})}
    
    // this method will handle the form action
    handleInvoiceFromAction=async(invoiceData,operations)=>{
        if(operations === FromActions.VI){
            const { authorization }=this.props.LoginState
            const { GetInvoiceUserList }=this.props.InvoiceAction
            await this.handleInvoiceLoadvalue();
            (invoiceData && invoiceData.id) && await GetInvoiceUserList(0,20,invoiceData.id,authorization)
            await this.handleInvoiceLoadvalue();
            await this.setState({invoiceData, operations, fromAction: !this.state.fromAction})
        }else{
            this.setState({ invoiceData,fromAction: !this.state.fromAction, operations})
        }
    }

    render() { 
        const { fromAction }=this.state
        return <Card> {fromAction ? this.loadInvoiceFrom() : this.loadInvoiceTable()}</Card>;
    }

    loadInvoiceFrom=()=>{
        const { operations, invoiceData }=this.state
        if(operations === FromActions.VIED){
            return <>
                <Invoice inoiceData={invoiceData} />
                <center>
                    <Button type="button" variant="outlined" color="primary" onClick={async ()=> await dwonloadInvoice()} >Download Invoice</Button> &nbsp;&nbsp;
                    <Button type="button" variant="outlined" color="secondary" onClick={async () => { await this.handleInvoiceFromAction();} }> Cancel</Button>&nbsp;&nbsp;
                </center>
            </>
        } 
        return  <InvoiceFrom  initialValues={invoiceData} cancle={this.handleInvoiceFromAction} />
    }

    loadInvoiceTable=()=>{
        const { loadInvoiceList }=this.state
        return  < div style={{ paddingRight: 10 }}>  {loadInvoiceList ? renderLoading({ message:"Loading Invoice Management", size:80}) :this.loadingInvoiceTable()} </div>
    }

    loadingInvoiceTable=()=>{
        return <>
            {this.loadInvoicePayment()}
            <InvoiceTable 
                fromAction={this.handleInvoiceFromAction}
                viewInvoice={this.loadInvoiceView}
                makeInvoicePayment={this.handleMakePayInvoice}
            />
        </>
    }

    loadInvoicePayment=()=>{
        const { makePayInvoice, invoiceData }=this.state
        return <>
            <InvoicePayDialog 
                invoiceData={invoiceData}
                open={makePayInvoice}
                handleClose={this.handleMakePayInvoice}
                saveMethod={this.makeInvoicePayment}
            />
        </>
    }

    makeInvoicePayment=async(invoiceData)=>{
        const { authorization }=this.props.LoginState
        const { payInvoiceBill,getPDFInvoiceList }=this.props.InvoiceAction
        const { id }=invoiceData
        await this.handleInvoiceLoadvalue();
        await payInvoiceBill(id,authorization);
        setTimeout(async () => {
            await getPDFInvoiceList(0, 100, authorization);
            this.handleMakePayInvoice();
            this.handleInvoiceLoadvalue();
        }, API_EXE_TIME)
    }
}

const InvoicePayDialog=(props)=>{
    const { open, handleClose, invoiceData, saveMethod }=props
    return <div>
    <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title" >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title"> Payment for Invoice </DialogTitle>
      <DialogContent>
        <DialogContentText>
            Are you sure the Invoice number <b>{invoiceData && invoiceData.invoiceNo}</b> has been cleared?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary"> No </Button>
        <Button onClick={()=>saveMethod(invoiceData)} color="secondary"> Yes </Button>
      </DialogActions>
    </Dialog>
  </div>
}

const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
    ClientAction: bindActionCreators(ClientAction, dispatch),
    InvoiceAction: bindActionCreators(InvoiceAction, dispatch),
})
export default connect(mapStateToProps,mapDispatchToProps)(InvoiceManagement);
