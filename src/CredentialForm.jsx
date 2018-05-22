import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

class CredentialForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: this.props.context ? this.props.context.error : false,
            registerForm: this.props.formType == "register"
        };
        // Seperate error text from dialog open state to avoid user seeing text disappear before the dialog does.
        this.state.dialogOpen = !!this.state.error;
    }

    onInputChange(ctx, ev) {
        ctx.setState({
            [ev.target.name]: ev.target.value
        });
    }

    clearError(ctx) {
        ctx.setState({
            dialogOpen: false
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <div>
                test
            </div>
        );
    }
}

export default withStyles((theme) => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
        margin: "0 auto",
        width: "40%"
    },
    textField: {
        color: "white",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    inputButton: {
        margin: 10
    }
}))(CredentialForm);