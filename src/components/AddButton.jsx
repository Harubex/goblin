import React from "react";
import {withStyles} from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import AddIcon from "material-ui-icons/Add";

class AddButton extends React.Component {

    constructor() {
        super();
        this.state = {
            adding: false
        };
    }

    onAdding(context) {
        context.setState({
            adding: true
        });
    }

    doneAdding(context) {
        context.setState({
            adding: false
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Dialog open={this.state.adding} onRequestClose={() => {this.doneAdding(this)}}>
                    <DialogTitle>{this.props.dialogTitle}</DialogTitle>
                    <DialogContent>{this.props.dialogContent}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.doneAdding(this)}} color="primary">
                            {this.props.cancelText || "Cancel"}
                        </Button>
                        <Button onClick={() => {this.props.onAdd(this)}} color="primary">
                            {this.props.doneText || "Done"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button fab color="primary" className={classes.button} onClick={() => {this.onAdding(this)}}>
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

export default withStyles((theme) => ({
    button: {
        margin: theme.spacing.unit,
        position: "absolute",
        bottom: "5%",
        right: "5%"
    }
}))(AddButton);