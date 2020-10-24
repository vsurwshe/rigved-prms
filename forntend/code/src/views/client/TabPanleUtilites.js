import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other} >
        {value === index && (<Box p={3}> <Typography>{children}</Typography> </Box>)}
    </div>
}

function a11yProps(index) {
    return { id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`, };
}

const useStyles = makeStyles((theme) => ({
    root: { flexGrow: 1, backgroundColor: theme.palette.background.paper, },
}));

const SimpleTabs = (props) => {
   const { tabData } = props
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const handleChange = (event, newValue) => { setValue(newValue); };
   return <div className={classes.root}>
       <AppBar position="static" color="default">
           <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
               {tabData.map((item, key) => { return <Tab key={key} label={item.label} {...a11yProps(key)} /> })}
           </Tabs>
       </AppBar>
       {tabData.map((item, key) => { return <TabPanel value={value} key={key} index={key}>{item.component}</TabPanel> })}
   </div>
}

export default SimpleTabs;