import React, { Component } from 'react';
import InvoiceFrom from './InvoiceFrom';
import { connect } from 'react-redux';
import { Card } from '@material-ui/core';
import InvoiceTable from './InvoiceTable';
import * as ClientAction from "../../redux/actions/ClientAction";
import * as InvoiceAction from '../../redux/actions/InvoiceAction';
import { bindActionCreators } from 'redux';
import { FromActions } from '../../assets/config/Config';
import { renderLoading } from '../utilites/FromUtilites';
class InvoiceManagement extends Component {
    state = {  
        loadInvoiceList:false,
        fromAction:false,
        operations:"",
        invoiceData:[],
        pdfInvoiceData:[]
    };

    componentDidMount=async()=>{
        const { listOfClient }=this.props.ClientState
        const { invoiceList }=this.props.InvoiceState
        const { authorization }=this.props.LoginState
        const { GetClientList, loadMessage }=this.props.ClientAction
        const { GetInvoiceList }=this.props.InvoiceAction
        await this.handleInvoiceLoadvalue();
        (listOfClient && listOfClient<=0)&& await GetClientList(0,20,authorization);
        (invoiceList && invoiceList<=0)&& await GetInvoiceList(0,20,authorization);
        await loadMessage();
        await this.handleInvoiceLoadvalue();
    }
    
    // this method will handle the progress bar datas
    handleInvoiceLoadvalue=()=>{ this.setState({loadInvoiceList: !this.state.loadInvoiceList})}
    
    // this method will handle the form action
    handleInvoiceFromAction=async(invoiceData,operations)=>{
        if(operations === FromActions.VI){
           await this.loadInvoiceView(invoiceData);
           await this.setState({operations, fromAction: !this.state.fromAction})
        }else{
            this.setState({ invoiceData,fromAction: !this.state.fromAction, operations})
        }
    }

    render() { 
        const { fromAction, invoiceData }=this.state
        return <Card> {fromAction ? this.loadInvoiceFrom(invoiceData) : this.loadInvoiceTable()}</Card>;
    }

    loadInvoiceView=(invoiceData)=>{
        this.loadInvoiceFrom({
            "name":"vishva"
        },true)
    }

    loadInvoiceFrom=(invoiceData, viewInvoice)=>{
        return  <InvoiceFrom 
            cancle={this.handleInvoiceFromAction}
            viewInvoiceData={invoiceData}
            viewInvoiceByID={viewInvoice}
        />
    }

    loadInvoiceTable=()=>{
        const { loadInvoiceList }=this.state
        return  < div style={{ paddingRight: 10 }}>  {loadInvoiceList ? renderLoading({ message:"Loading Invoice Management", size:80}) :this.loadingInvoiceTable()} </div>
    }

    loadingInvoiceTable=()=>{
        return <InvoiceTable 
            fromAction={this.handleInvoiceFromAction}
        />
    }
}

const mapStateToProps = state => { return state; };
const mapDispatchToProps = (dispatch) => ({
    ClientAction: bindActionCreators(ClientAction, dispatch),
    InvoiceAction: bindActionCreators(InvoiceAction, dispatch),
})
export default connect(mapStateToProps,mapDispatchToProps)(InvoiceManagement);