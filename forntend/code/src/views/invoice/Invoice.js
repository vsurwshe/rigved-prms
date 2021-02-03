
import React from 'react';
import "../../scss/invoiceTemplate.css"
let Invoice=(props)=>{
    const {inoiceData }=props
    return LoadInvoiceTable(inoiceData);
}
const LoadInvoiceTable=(props)=>{
return <div  className="invoice-box">
    <table id="invoiceProject" cellPadding="0" border="1" cellSpacing="0">
        <tbody>
            {MainTableSectionOne()}
            {MainTableSectionTwo({"mainProps":props})}
            {MainTableSectionThree({"mainProps":props})}
            {MainTableSectionFourth({"mainProps":props})}
        </tbody>
    </table>
</div>
}
const MainTableSectionOne=(propsData)=>{ 
    return <table className="table-border-bottom">
        <tbody>
            <tr> <td ><center>Tax Invoice</center></td></tr>
        </tbody>
    </table>
}
const MainTableSectionTwo=(propsData)=>{
    const { mainProps }=propsData
    return <table>
                <tbody>
                    {FormSection({"mainProps":mainProps})}
                    {ContactAndInvoiceDetailsRow({"mainProps":mainProps})}
                    {ToSection({"mainProps":mainProps})}
                </tbody>
        </table>
}
// this will load the from Section row
const FormSection=(propsData)=>{
    const { mainProps }=propsData
    return<table style={{width: "50%"}}>
        <tbody>
            <tr>
                <td>
                    <p style={{fontSize:12 , lineHeight:"normal"}}>
                    <b>Name: {mainProps && mainProps.fromCompanyName}</b><br/>
                        <b>Registered Address:</b> <br/>
                        {mainProps && mainProps.fromcompanyAddress}<br/>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
}
// this will load the Conact info and Details Row
const ContactAndInvoiceDetailsRow=(propsData)=>{
    const { mainProps }=propsData
    return<table style={{marginTop:"-20px"}}>
        <tbody>
            <tr>
                <td>
                    <p style={{fontSize:12 , lineHeight:"normal"}}>
                           Contact No : {mainProps && mainProps.contactNo}<br/>
                           Email Id: {mainProps && mainProps.emailId} <br/>
                           CIN No.: {mainProps && mainProps.CIN}<br/>
                        <b>Pan No.: {mainProps && mainProps.fromPANNo}</b><br/>
                        <b>GSTIN No.: {mainProps && mainProps.fromGstNo}</b><br/>
                        <b>SAC CODE : {mainProps && mainProps.fromSACCode}</b>
                    </p>
                </td>
                <td>
                    <p style={{fontSize:12 , lineHeight:"normal"}}>
                        Invoice #: <b>{mainProps && mainProps.invoiceNo}</b> <br />
                        Date:<b>{mainProps && mainProps.invoiceDate}</b>
                    </p>  
                </td>
            </tr>
        </tbody>
    </table>
}
// this will load the to info details row
const ToSection=(propsData)=>{
    const { mainProps }=propsData
    return <table style={{marginTop:"-25px"}}>
            <tbody>
                <tr>
                    <td>
                        <p style={{fontSize:12 ,fontWeight:"bold", lineHeight:"normal"}}>
                            To,<br/>
                            {mainProps && mainProps.toCompanyAddress}
                        </p>
                        <p style={{fontSize:12 , fontWeight:"bold", lineHeight:"normal"}}>
                            Pan No.: {mainProps && mainProps.toPanNo}<br/>
                            GSTIN No.: {mainProps && mainProps.toGstNo}<br/>
                        </p>
                    </td>
                </tr>
            </tbody>
    </table> 
}
const MainTableSectionThree=(propsData)=>{
    const {mainProps }=propsData
    return <table style={{fontSize:"12px" , borderCollapse:"collapse", lineHeight:"initial"}} cellPadding="0" border="1" cellSpacing="0">
        <thead style={{fontWeight:"bold"}}>
            <tr>
                <td>Description</td>
                <td>{'Qty.\u00a0/\u00a0No.\u00a0of\u00a0Resources'}</td>
                <td>Rate</td>
                <td>Amount</td>
            </tr>
        </thead>
        <colgroup>
            <col span="1" style={{width: "60%"}} />
            <col span="1" style={{width: "10%"}} />
            <col span="1" style={{width: "10%"}} />
            <col span="1" style={{width: "10%"}} />
        </colgroup>
        <tbody>
            <tr style={{paddingTop:"1em"}}>
                <td>{mainProps && mainProps.description}</td>
                <td></td>
                <td>{mainProps && mainProps.billWitoutGST}</td>
                <td>{mainProps && mainProps.billWitoutGST}</td>
            </tr>
            <tr>
                <td><b>Total Amount Before Tax</b></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            { 
                (mainProps && mainProps.cgst) && <tr>
                    <td>Add :CGST @ 9.0%</td>
                    <td></td>
                    <td></td>
                    <td>{mainProps.cgst}</td>
                </tr>
            }
            { 
                (mainProps && mainProps.sgstutgs) && <tr>
                    <td>Add :SGST @ 9.0%</td>
                    <td></td>
                    <td></td>
                    <td>{mainProps.sgstutgs}</td>
                </tr>
            }
            { 
                (mainProps && mainProps.igst) && <tr>
                    <td>Add :IGST @ 18%</td>
                    <td></td>
                    <td></td>
                    <td>{mainProps.igst}</td>
                </tr>
            }
            <tr>
                <td><b>Total Amount After Tax</b></td>
                <td></td>
                <td><b>RS. /-</b></td>
                <td>{mainProps && mainProps.billWitGST}</td>
            </tr>
            {
                (mainProps && mainProps.totalBillingInWords) &&<tr>
                    <td><b>{mainProps && mainProps.totalBillingInWords}</b></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            }
        </tbody>
    </table>
}
const MainTableSectionFourth=(propsData)=>{
    return <table>
        <tbody>
            <tr><td>{FooterBankSections(propsData)}</td></tr>
            <tr><td>{FooterDigitalSignSections(propsData)}</td></tr>
        </tbody>
    </table>
}
const FooterBankSections=(propsData)=>{
    return <table>
    <tbody>
        <tr>
            <td>
                <p style={{fontSize:12 , fontWeight:"bold", lineHeight:"normal"}}>
                    Cheque should be drawn in Favour of. <u>Rigved Technologies Private Limited</u>
                </p>
                <p style={{fontSize:12 , lineHeight:"normal"}}>
                    <b>Bank Details:</b> <br/>
                    Account Name.: Rigved Technologies Private Limited<br/>
                    Bank Name: Axis Bank Ltd<br/>
                    Bank Account No: 916020022757685<br/>
                    IFSC Code: UTIB0000183<br />
                    Account Type: Current<br/>
                    Bank Address: Vile Parle East Mumbai.
                </p>
            </td>
        </tr>
    </tbody>
</table>
}
const FooterDigitalSignSections=(propsData)=>{
    return<table style={{float:"right", position:"relative", width:"30%", marginTop:"-45px"}}>
        <tbody>
            <tr><td><p style={{fontSize:12 , fontWeight:"bold", lineHeight:"normal"}}>For Rigved Technologies Pvt Ltd</p></td></tr>
        </tbody>
    </table> 
}
export default Invoice;