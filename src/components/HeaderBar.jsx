import React from "react";
import PropTypes from "prop-types";
import HomeIcon from "material-ui-icons/Home";
import {withStyles} from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import Menu, {MenuItem} from "material-ui/Menu";
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
        const classes = this.props.classes;
        const session = this.props.session || {};
        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar disableGutters>
                        <IconButton className={classes.menuButton} color="contrast">
                            <HomeIcon />
                        </IconButton>
                        <div className={classes.leftItems}>
                            <a className={classes.menuLink} href="/cards">
                                <Button color="contrast">Card Search</Button>
                            </a>
                            <a className={classes.menuLink} href="/collections">
                                <Button color="contrast">Collection Manager</Button>
                            </a>
                            <a className={classes.menuLink} href="/decks">
                                <Button color="contrast">Deck Editor</Button>
                            </a>
                        </div>
                        <div className={classes.rightItems}>
                            {session.username ? (
                                <div>
                                    <Button color="contrast" onMouseOver={(ev) => this.openMenu(this, ev)}>
                                        {session.username}
                                    </Button>
                                    <Menu open={this.state.menuOpen} anchorEl={this.state.menuEle} transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left"
                                    }} onRequestClose={() => this.closeMenu(this)}>
                                        <MenuItem onClick={this.handleRequestClose}>
                                            <a className={classes.menuLink} href="/account">
                                                Account    
                                            </a>
                                        </MenuItem>
                                        <MenuItem onClick={this.handleRequestClose}>
                                            <a className={classes.menuLink} href="/settings">
                                                Settings    
                                            </a>
                                        </MenuItem>
                                        <MenuItem onClick={this.handleRequestClose}>
                                            <a className={classes.menuLink} href="/user/logout">
                                                Logout    
                                            </a>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            ) : (
                                <div>
                                    <a className={classes.menuLink} href="/user/login">
                                        <Button color="contrast">Login</Button>
                                    </a>
                                    <a className={classes.menuLink} href="/user/register">
                                        <Button color="contrast">Register</Button>
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
        width: "100%",
        paddingBottom: "1em",
    },
    menuLink: {
        textDecoration: "none",
        color: "black",
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