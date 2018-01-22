import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import AddIcon from "material-ui-icons/Add";
import SvgIcon from "material-ui/SvgIcon";

let styles = {
    button: {
        position: "absolute"
    }
};

class DialogButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false
        };
    }

    onButtonClick(ctx) {
        if (ctx.props.showDialog) {
            ctx.setState({
                dialogOpen: true
            });
        }
        if (ctx.props.buttonClicked) {
            ctx.props.buttonClicked(ctx);
        }
    }

    onCancel(ctx) {
        ctx.setState({
            dialogOpen: false
        });
    }

    onDone(ctx) {
        ctx.onCancel(ctx);
        if (ctx.props.dialogDone) {
            ctx.props.dialogDone(ctx);
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Dialog open={this.state.dialogOpen} onClose={() => {this.onCancel(this)}}>
                    <DialogTitle>{this.props.dialogTitle}</DialogTitle>
                    <DialogContent>{this.props.dialogContent}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.onCancel(this)}} color="primary">
                            {this.props.cancelText || "Cancel"}
                        </Button>
                        <Button onClick={() => {this.onDone(this)}} color="primary">
                            {this.props.doneText || "Done"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button fab color="primary" className={classes.button} onClick={() => {this.onButtonClick(this)}} style={this.props}>
                    {this.props.icon}
                </Button>
            </React.Fragment>
        );
    }
}

DialogButton.propTypes = {
    dialogTitle: PropTypes.string,
    dialogContent: PropTypes.any,
    icon: PropTypes.node,
    doneText: PropTypes.string,
    cancelText: PropTypes.string,
    dialogDone: PropTypes.func,
    buttonClicked: PropTypes.func,
    showDialog: PropTypes.bool,
    top: PropTypes.string,
    right: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string
};

DialogButton.defaultProps = {
    doneText: "Done",
    cancelText: "Cancel",
    dialogDone: () => {},
    buttonClicked: () => {},
    icon: <AddIcon />,
    showDialog: true,
    right: "5%",
    bottom: "5%"
}

export default withStyles(styles)(DialogButton);