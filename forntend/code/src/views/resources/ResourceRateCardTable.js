import React from 'react';
import MaterialTable from 'material-table';
import { FormControlLabel, Radio } from '@material-ui/core';

const ResourceRateCardTable=(props)=>{
    const {tableData, headerText, setSelectedRateCard}=props
    // creating columns
    const columns = [
        {   title: "",
            width: 8,
            render: (rowData) => {  return <FormControlLabel value={rowData.rateCardId} control={<Radio  onChange={() => setSelectedRateCard(rowData)} variant="outlined" color="primary" />} label="" /> }
        },
        {   title: 'Domain\u00a0Name', field: 'domainName'},
        {   title: 'Category', field: 'skillCategory' },
        {   title: 'Skill', field: 'skillSet' },
        {   title: 'Exprience', field: 'exp' },
        {   title: 'Rate', field: 'rate' }
    ];

    let data=(tableData && tableData.length >0) && tableData.map((item,key)=>{
        return {"data": item, "rateCardId": item.id,"domainName":item.domainName,"exp":item.fromYearOfExp+"-"+item.toYearOfExp,"rate":item.rate,"skillCategory":item.skillCategory,"skillSet":item.skillSet}
    })
    return <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          title={headerText}
          columns={columns}
          data={(data && data.length > 0) ? data : []}
          options={{ headerStyle: { backgroundColor: '#01579b', color: '#FFF' } }}
        />
    </div>
}

export default ResourceRateCardTable;