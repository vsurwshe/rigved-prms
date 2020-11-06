import React from 'react';
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useStyles from "./styles";
import Widget from "./widget/Widget"
import Dot from "./widget/Dot"
import { Typography } from "./widget/Wrappers"


const PieChartDataRevenue=(propsData)=>{
    const { PieChartData , title }=propsData 
    var theme = useTheme();
    var classes = useStyles();
    return <Grid item lg={4} md={4} sm={6} xs={12}>
    <Widget title={title} upperTitle className={classes.card}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ResponsiveContainer width="100%" height={144}>
            <PieChart margin={{ left: theme.spacing(2) }}>
              <Pie data={PieChartData} innerRadius={45} outerRadius={60} dataKey="value" >
                {PieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.palette[entry.color].main} />
                ))} 
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.pieChartLegendWrapper}>
            {PieChartData.map(({ name, value, color }, index) => (
              <div key={color} className={classes.legendItemContainer}>
                <Dot color={color} />
                <Typography style={{ whiteSpace: "nowrap" }}> &nbsp;{name}&nbsp; </Typography>
                <Typography color="text" colorBrightness="secondary"> &nbsp;{value} </Typography>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </Widget>
  </Grid>
}


const LineChartRevenue=(propsData)=>{
    const { data , title }=propsData 
    var classes = useStyles();

    return <Grid item lg={4} md={4} sm={6} xs={12}>
      <Widget title={title} upperTitle bodyClass={classes.fullHeightBody} className={classes.card} >
        <div className={classes.visitsNumberContainer}>
          <Typography size="xl" weight="medium">{data.total} </Typography>
        </div>
        <Grid container direction="row" justify="space-between" alignItems="center" >
          <Grid item>
            <Typography color="text" colorBrightness="secondary"> Complete </Typography>
            <Typography size="md">{data.totalReceived}</Typography>
          </Grid>
          <Grid item>
            <Typography color="text" colorBrightness="secondary"> In-Process </Typography>
            <Typography size="md">{data.totalInProcess}</Typography>
          </Grid>
          <Grid item>
            <Typography color="text" colorBrightness="secondary"> Pending </Typography>
            <Typography size="md">{data.totalPending}</Typography>
          </Grid>
        </Grid>
      </Widget>
    </Grid>
}

export {
    PieChartDataRevenue,
    LineChartRevenue
}