import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Grid } from "@material-ui/core";
// components
import { Typography } from "../Wrappers";
// styles
import useStyles from "../styles";
import { Field, reduxForm, reset } from 'redux-form';
import { renderAutocompleteByName, renderDateTimePicker } from '../../utilites/FromUtilites';

const DashboardFilter=(props)=>{
  const { title, clientSerise, filterByClient, projectSerise,callFilterChartAPI }=props
  const classes = useStyles();
   return <div style={{paddingBottom:"1%"}}>
        <SerachPanelFrom 
            classes={classes}
            clientSerise={clientSerise}
            filterByClient={filterByClient}
            projectSerise={projectSerise}
            title={title}
            callFilterChartAPI={callFilterChartAPI}
        />
    </div>
  }

  let SerachPanelFrom=(props)=>{
    const { callFilterChartAPI, classes, title, handleSubmit } = props
    return  <Accordion>
        <AccordionSummary aria-label="Expand" aria-controls="additional-actions1-content" >
            <Typography className={classes.typo} variant="h3" size="sm"> {title} </Typography>
        </AccordionSummary> 
        <AccordionDetails>
            <form onSubmit={handleSubmit(callFilterChartAPI)}>
               {LoadGrid(props)}
            </form>
        </AccordionDetails>
    </Accordion>
  }

  const LoadGrid=(props)=>{
    const { clientSerise, pristine, projectSerise, submitting } = props
      return <Grid container  style={{ paddingLeft: 10}}>
      <Grid item xs={12} sm={3} style={{ paddingLeft: 10}}>
          <Field name="clientId" component={renderAutocompleteByName} label="Select Client" optionData={clientSerise} margin="normal" />
      </Grid>
      <Grid item xs={12} sm={3} style={{ paddingLeft: 10}}>
          <Field name="projectId"  component={renderAutocompleteByName} label="Select Project" optionData={projectSerise} margin="normal" />
      </Grid>
      <Grid item xs={12} sm={3} style={{ paddingLeft: 10}}>
          <Field name="fromDate" component={renderDateTimePicker} type="date" label="Form Date" helperText="Ex. 01/01/2000"  margin="normal" />
      </Grid>
      <Grid item xs={12} sm={3} style={{ paddingLeft: 2}}>
          <Field name="toDate" component={renderDateTimePicker} type="date" label="To Date" helperText="Ex. 01/01/2000"  margin="normal" />
      </Grid>
      <Button type="submit" style={{ margin:10, float:"right"}} variant="outlined" color="secondary" disabled={pristine || submitting} > Apply Filter</Button>
      <Button type="button" style={{ margin:10, float:"right"}} variant="outlined" color="secondary" > Reset Filter</Button>
 </Grid>
}

const validateDashboardSerachPanel=(props)=>{
    const errors={}
    if((!props.fromDate && props.toDate) || (props.fromDate && !props.toDate)){
        errors.fromDate=!props.fromDate && "From Date is required";
        errors.toDate=!props.toDate && "To Date is required";
    }
    return errors;
}


const afterSubmit = (result, dispatch) => dispatch(reset('DashBoardSerachPanle'));
SerachPanelFrom= reduxForm({form: 'DashBoardSerachPanle',validate: validateDashboardSerachPanel, onSubmitSuccess: afterSubmit})(SerachPanelFrom);


export{
    DashboardFilter
}
