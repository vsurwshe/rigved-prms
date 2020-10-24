import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, } from "@material-ui/core";
import {
  Menu as MenuIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";
// importing all login actions
import * as LoginActions from "../../redux/actions/LoginAction";
// components
import {Typography } from "../Wrappers/Wrappers";
// context
import { useLayoutState, useLayoutDispatch, toggleSidebar } from "../../context/LayoutContext";
import { connect } from "react-redux";

const Header=(props)=> {
  var classes = useStyles();
  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  // local
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton color="inherit" onClick={() => toggleSidebar(layoutDispatch)} className={classNames(classes.headerMenuButton,classes.headerMenuButtonCollapse, )} >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon classes={{ root: classNames( classes.headerIcon, classes.headerIconCollapse, )}}/>
            ) : (
            <MenuIcon classes={{ root: classNames( classes.headerIcon, classes.headerIconCollapse, ) }} />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}> Rigved Technologies </Typography>
        <div className={classes.grow} />
          { SerachOptions({ classes, isSearchOpen , setSearchOpen}) }
        <IconButton aria-haspopup="true" color="inherit" className={classes.headerMenuButton} aria-controls="profile-menu" onClick={e => setProfileMenu(e.currentTarget)} >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu id="profile-menu" open={Boolean(profileMenu)} anchorEl={profileMenu} onClose={() => setProfileMenu(null)} className={classes.headerMenu} classes={{ paper: classes.profileMenu }} disableAutoFocusItem >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium"> admin </Typography>
            <Typography className={classes.profileMenuLink} component="a" color="primary" href="http://www.rigvedtech.com/" > Rigved Technologies </Typography>
          </div>
          <MenuItem className={classNames( classes.profileMenuItem, classes.headerMenuItem, )} >
            <AccountIcon className={classes.profileMenuIcon} /> Profile
          </MenuItem>
          <MenuItem className={classNames( classes.profileMenuItem, classes.headerMenuItem, )} >
            <AccountIcon className={classes.profileMenuIcon} /> Tasks
          </MenuItem>
          <MenuItem className={classNames( classes.profileMenuItem, classes.headerMenuItem, )} >
            <AccountIcon className={classes.profileMenuIcon} /> Messages </MenuItem>
          <div className={classes.profileMenuUser}>
            <Typography className={classes.profileMenuLink} color="primary" onClick={() =>  props.LogoutUser()} > Sign Out </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

// this function showing serach options in Header
const SerachOptions=(props)=>{
  const {classes, isSearchOpen , setSearchOpen}=props
  return <div className={classNames(classes.search, { [classes.searchFocused]: isSearchOpen})}>
  <div className={classNames(classes.searchIcon, { [classes.searchIconOpened]: isSearchOpen })} onClick={() => setSearchOpen(!isSearchOpen)} >
    <SearchIcon classes={{ root: classes.headerIcon }} />
  </div>
  <InputBase placeholder="Search…" classes={{ root: classes.inputRoot, input: classes.inputInput, }} />
</div>

}

const mapStateToProps = state => { return state; };
export default connect(mapStateToProps, LoginActions)(Header);