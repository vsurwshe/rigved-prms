import { makeStyles } from "@material-ui/styles";
export default makeStyles(theme => ({
    clientTableRoot: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5)
    },
    clientTableTable: { 
        minWidth: 500 
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    selectTextField: {
        marginRight: theme.spacing(0.8),
        width: '9ch',
    },
    textField1: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '20ch',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    textField2: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '65ch',
    },
    dialogPaper: {
        maxWidth: '300vh'
    },
    
}))