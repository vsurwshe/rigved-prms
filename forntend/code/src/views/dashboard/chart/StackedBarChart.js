import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Chart, Series, ArgumentAxis, Label, CommonSeriesSettings, Legend, ValueAxis, Title, Export, Tooltip } from 'devextreme-react/chart';

const StackedBarChart=(propsData)=>{
  const {dataSource,title, xAxisText, architectureSources }=propsData
  return <Paper>
    <Chart paletteExtensionMode="blend" id={title} title={title} dataSource={dataSource} >
        <CommonSeriesSettings argumentField="xaxis" type="stackedBar" />
        {(architectureSources && architectureSources.length  >0)&& architectureSources.map((item,key)=><Series key={key} valueField={item.value} name={item.name} />)}
        <ArgumentAxis> 
          <Label rotationAngle={50} overlappingBehavior="rotate" />
        </ArgumentAxis>
        <ValueAxis position="left"> 
          <Title text={xAxisText}/>
        </ValueAxis>
        <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="right" />
        <Export enabled={true} />
        <Tooltip enabled={true} location="edge" customizeTooltip={customizeTooltip} />
    </Chart>
  </Paper>
}
const customizeTooltip=(arg)=>{ return { text: `${arg.seriesName } = ${ arg.valueText}` }; }
export default StackedBarChart;