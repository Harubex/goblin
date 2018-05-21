import React from "react";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AutoCard from "./AutoCard";

class HeaderBar extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            menuEle: null
        };
    }

    openMenu(ctx, ev) {
        ctx.setState({
            menuEle: ev.currentTarget,
            menuOpen: true
        });
    }

    closeMenu(ctx) {
        ctx.setState({
            menuOpen: false
        });
    }

              
    render() {
        const { classes } = this.props;
        const session = this.props.session || {};
        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar disableGutters>
                        <IconButton className={classes.menuButton} className={classes.whiteButton}>
                            <HomeIcon />
                        </IconButton>
                        <div className={classes.leftItems}>
                            <a className={classes.menuLink} href="/cards">
                                <Button className={classes.whiteButton}>Card Search</Button>
                            </a>
                            <a className={classes.menuLink} href="/collections">
                                <Button className={classes.whiteButton}>Collection Manager</Button>
                            </a>
                            <a className={classes.menuLink} href="/decks">
                                <Button className={classes.whiteButton}>Deck Editor</Button>
                            </a>
                        </div>
                        <div className={classes.rightItems}>
                            {session.username ? (
                                <div>
                                    <Button className={classes.whiteButton} onMouseOver={(ev) => this.openMenu(this, ev)}>
                                        {session.username}
                                    </Button>
                                    <Menu open={this.state.menuOpen} anchorEl={this.state.menuEle} transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left"
                                    }} onClose={() => this.closeMenu(this)}>
                                        <MenuItem>
                                            <a className={classes.menuLink} href="/account">
                                                Account
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a className={classes.menuLink} href="/settings">
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a className={classes.menuLink} href="/collections/import">
                                                Import/Export
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a className={classes.menuLink} href="/user/logout">
                                                Logout
                                            </a>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            ) : (
                                <div>
                                    <a className={classes.menuLink} href="/user/login">
                                        <Button className={classes.whiteButton}>Login</Button>
                                    </a>
                                    <a className={classes.menuLink} href="/user/register">
                                        <Button className={classes.whiteButton}>Register</Button>
                                    </a>
                                </div>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

HeaderBar.propTypes = {
    currentUser: PropTypes.string
};

export default withStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
        paddingBottom: "1em",
    },
    flex: {
        flex: 1
    },
    menuLink: {
        textDecoration: "none",
        color: "black",
    },
    whiteButton: {
        color: "white"
    },
    leftItems: {
        flex: 1
    },
    rightItems: {
    },

    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    }
}))(HeaderBar);