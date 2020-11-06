import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import classnames from "classnames";
import Sidebar from "../views/Sidebar/Sidebar";
import Header from '../views/Header/Header'
// styles
import useStyles from "./styles";
import { useLayoutState } from "../context/LayoutContext";
import UserManagement from '../views/register/UserManagement';
import ClientManagment from '../views/client/ClientManagement';
import PurchaseOrderManagement from '../views/purchaseOrder/PurchaseOrderManagement';
import ProjectManagement from '../views/project/ProjectManagement';
import PurchaseOrderFrom from '../views/purchaseOrder/PurchaseOrderFrom';
import InvoiceManagement from '../views/invoice/InvoiceManagement'
import Dashboard from '../views/dashboard/Dashboard';
 
const RoutesPath=[
    {path:"/",component: Dashboard, exact: true},
    {path:"/register",component: UserManagement},
    {path:"/client",component: ClientManagment},
    {path:"/purchaseOrder",component: PurchaseOrderManagement},
    {path:"/project",component: ProjectManagement},
    {path:"/invoice",component: InvoiceManagement},
    {path:"/purchaseOrder/view",component: PurchaseOrderFrom, exact:true}
]

const Layout = (props) => {
    var classes = useStyles();
    // global
    var layoutState = useLayoutState();
    return <div className={classes.root}>
        <>
            <Header history={props.history} />
            <Sidebar />
            <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened})}>
                <div className={classes.fakeToolbar} />
                <Switch>
                    { RoutesPath.map((route,key)=>{ return <Route key={key} exact={route.exact} path={route.path} component={route.component} />})}
                </Switch>
            </div>
        </>
    </div>
}

export default withRouter(Layout);