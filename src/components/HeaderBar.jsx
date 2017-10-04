import React from "react";
import PropTypes from "prop-types";
import HomeIcon from "material-ui-icons/Home";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";

class HeaderBar extends React.Component { 
    constructor(props) {
        super(props);
    }
              
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <AppBar position="static">
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
                            {this.props.currentUser ? (
                                <a className={classes.menuLink} href="/account">
                                    <Button color="contrast">{this.props.currentUser}</Button>
                                </a>
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
        textDecoration: "none"
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