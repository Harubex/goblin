import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AccountMenu from "./AccountMenu";

class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.state = {
            menuAnchor: null
        };
    }

    /**
     * Set the anchor element to open the account menu on.
     * @param {Event} ev 
     */
    openMenu(ev) {
        this.setState({
            menuAnchor: ev.currentTarget
        });
    }

    closeMenu() {
        this.setState({
            menuAnchor: null
        });
    }


    render() {
        const { classes } = this.props;
        const { menuAnchor } = this.state;
        return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography className={classes.title} noWrap color="inherit" variant="headline">
                        {this.props.title}
                    </Typography>
                    <Button className={classes.button} disableRipple variant="flat" color="inherit" onClick={this.openMenu}>
                        <Typography className={classes.userlabel} variant="button">
                            {this.props.username}
                        </Typography>
                        <AccountCircle />
                    </Button>
                    {menuAnchor && <AccountMenu anchor={menuAnchor} closed={this.closeMenu} />}
                </Toolbar>
            </AppBar>
        );
    }
}

HeaderBar.propTypes = {
    title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
};

export default withStyles((theme) => ({
    title: {
        flexGrow: 1
    },
    button: {
        transition: "border-color 0.25s",
        border: "2px solid transparent",
        "&:hover": {
            borderColor: "currentColor",
            backgroundColor: "transparent"
        }
    },
    userlabel: {
        textTransform: "none",
        paddingRight: "0.5em"
    }
}))(HeaderBar);