import React from "react";
import {withStyles} from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import AutoCard from "./AutoCard";

class AddCardDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.addDialogOpen
        };
    }

    doneAdding(ctx) {
        ctx.props.onClose();
    }

    render() {
        const classes = this.props.classes;
        return (
            <Dialog open={this.props.open} onRequestClose={() => {this.doneAdding(this)}}>
                <DialogTitle className={classes.dialogContent}>Add New Cards</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <AutoCard collectionId={this.props.collectionId} onAdd={this.props.onAdd} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {this.doneAdding(this)}} color="primary">
                        {this.props.cancelText || "Cancel"}
                    </Button>
                    <Button onClick={() => {this.doneAdding(this)}} color="primary">
                        {this.props.doneText || "Done"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles((theme) => ({
    dialogContent: {
        minWidth: "400px",
        textAlign: "center"
    }
}))(AddCardDialog);