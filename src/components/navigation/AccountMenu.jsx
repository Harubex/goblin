import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";

class AccountMenu extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Menu
                marginThreshold={0}
                open={!!this.props.anchor} 
                anchorEl={this.props.anchor} 
                classes={{ paper: classes.menu }} 
                elevation={0} 
                onClose={this.props.closed} 
                TransitionProps={{
                    in: !!this.props.anchor
                }}
                MenuListProps={{
                    dense: true
                }}
                transformOrigin={{
                    horizontal: "left",
                    vertical: "bottom"
                }}
            >
                <MenuItem onClick={this.props.closed}>Profile</MenuItem>
                <MenuItem onClick={this.props.closed}>My account</MenuItem>
                <MenuItem onClick={this.props.closed}>Logout</MenuItem>
            </Menu>
        );
    }
}

AccountMenu.propTypes = {
    anchor: PropTypes.instanceOf(EventTarget),
    closed: PropTypes.func.isRequired
};

export default withStyles((theme) => ({
    menu: {
        marginTop: "3em",
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main
    }
}))(AccountMenu);