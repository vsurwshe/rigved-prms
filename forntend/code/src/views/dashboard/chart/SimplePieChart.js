import React from 'react';
import Paper from '@material-ui/core/Paper';
import PieChart, { Legend, Export, Series, Label, Font, Connector } from 'devextreme-react/pie-chart';
import { Tooltip } from 'devextreme-react/chart';

const SimplePieChart=(propsData)=>{
    const { dataSource, title }=propsData
    return <Paper> 
        <PieChart 
          id={title}
          paletteExtensionMode="blend" 
          dataSource={dataSource} 
          title={title} 
          resolveLabelOverlapping="shift">
            <Legend 
              orientation="horizontal" 
              itemTextPosition="right" 
              horizontalAlignment="left" 
              verticalAlignment="bottom" 
              columnCount={7}  
              />
            <Export enabled={true} />
            <Series argumentField="field" valueField="value">
              <Label visible={true} position="columns" customizeText={customizeText}>
                <Font size={11} />
                <Connector visible={true} width={0.5} />
              </Label>
            </Series>
            <Tooltip enabled={true} location="edge" customizeTooltip={customizeTooltip} />
        </PieChart>
  </Paper>
}

function customizeText(arg) { return `${arg.argumentText} (${arg.value})`; }
const customizeTooltip=(arg)=>{ return { text: `${arg.argumentText } = ${ arg.valueText}` }; }
export default SimplePieChart;