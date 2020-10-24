import React, { useState } from "react";
import { Grid, Typography, Tabs, Tab} from "@material-ui/core";
import useStyles from "./styles";
import { useUserDispatch } from "../../context/UserContext";
import Login from "./UserLogin";
import { connect } from "react-redux";
import Layout from "../../layout/Layout";
import { Alert } from "@material-ui/lab";

const UserActions = (props) => {
    var classes = useStyles();
    // global
    var userDispatch = useUserDispatch();
    // local
    var [isLoading, setIsLoading] = useState(false);
    var [error, setError] = useState(null);
    var [activeTabId, setActiveTabId] = useState(0);
    var [loginValue, setLoginValue] = useState("");
    var [passwordValue, setPasswordValue] = useState("");
    const data = {
        loginValue,
        passwordValue,
        isLoading,
        props,
        error,
        setIsLoading,
        setLoginValue,
        setPasswordValue,
        setError,
        classes,
        userDispatch
    }

    if (props.LoginState.authorization && props.LoginState.authorization !== "") {
        return <Layout />
    }
    return (
        <Grid container className={classes.container}>
            <div className={classes.formContainer}>
                <div className={classes.form}>
                {props.LoginState.common_message && <Alert severity={props.LoginState.color} >{props.LoginState.common_message}</Alert>}
                    <Tabs value={activeTabId} onChange={(e, id) => setActiveTabId(id)} indicatorColor="primary" textColor="primary" centered >
                        <Tab label="Login" classes={{ root: classes.tab }} />
                    </Tabs>
                    <Login data={data} />
                </div>
                <Typography color="primary" className={classes.copyright}> © 2020-Rigved Technologies. All rights reserved.</Typography>
            </div>
        </Grid>);
}

const mapStateToProps = state => { return state; };
export default connect(mapStateToProps)(UserActions);
