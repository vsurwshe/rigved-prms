import { makeStyles } from "@material-ui/styles";
export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    girdContainer: {
        flexGrow: 1,
    },
    clickAwayListenerRoot: {
        position: 'relative',
    },
    clickAwayListenerDropdown: {
        position: 'absolute',
        top: 28,
        right: 0,
        left: 0,
        zIndex: 1,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
    },
    buttonStyle : {
        marginTop: 10,
        marginBottom: 10,
        margin: theme.spacing(1)
    }
}))