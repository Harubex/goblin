import React from "react";
import PropTypes from "prop-types";
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import HomeIcon from "material-ui-icons/Home";
import { withStyles } from "material-ui/styles";

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
                            <a href="/cards">
                                <Button color="contrast">Card Search</Button>
                            </a>
                            <a href="/collections">
                                <Button color="contrast">Collection Manager</Button>
                            </a>
                            <a href="/decks">
                                <Button color="contrast">Deck Editor</Button>
                            </a>
                        </div>
                        <div className={classes.rightItems}>
                            {this.props.currentUser ? (
                                <a href="/account">
                                    <Button color="contrast">{this.props.currentUser}</Button>
                                </a>
                            ) : (
                                <a href="/login">
                                    <Button color="contrast">Login</Button>
                                </a>
                            )}
                            <a href="/register">
                                <Button color="contrast">Register</Button>
                            </a>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles({
    root: {
        width: "100%",
        paddingBottom: "1em"
    },
    leftItems: {
    },
    rightItems: {
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    }
})(HeaderBar);