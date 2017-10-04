import React from "react";
import {withStyles} from "material-ui/styles";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import Input from "material-ui/Input";
import Button from "material-ui/Button";

class CredentialForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        }
    }

    onLogin(ctx, ev) {
        ctx.onSubmit(ctx, ev, "login");
    }

    onRegister(ctx, ev) {
        ctx.onSubmit(ctx, ev, "register");
    }

    onSubmit(ctx, ev, type) {
        ev.preventDefault();
        document.body.classList.add("waiting");
        fetch(new Request(`/user/${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                credentials: "same-origin"
            },
            body: JSON.stringify(ctx.state)
        })).then((resp) => {
            resp.text().then((msg) => {
                if (resp.status >= 400) {
                    ctx.setState({
                        error: msg
                    });
                } else {
                    ctx.props.onLogged(ctx.state);
                    window.location.replace("/collections");
                }
            });
        });
    }

    onInputChange(ctx, ev) {
        ctx.setState({
            [ev.target.name]: ev.target.value
        });
    }

    clearError(ctx) {
        ctx.setState({
            error: false
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Dialog title="Error" modal={false} open={!!this.state.error} onRequestClose={() => this.clearError(this)}>
                    <DialogTitle>{"Unable to log in"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.error}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.clearError(this)} color="primary">
                            {"Okay"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <form className={classes.container} 
                    onSubmit={(ev) => this.props.formType == "register" ? this.onRegister(this, ev) : this.onLogin(this, ev)}>
                    <TextField autoFocus className={classes.textField} name="username" label="Username"
                    fullWidth={true} required onChange={(ev) => this.onInputChange(this, ev)} />
                    <TextField className={classes.textField} name="password" label="Password" 
                    fullWidth={true} required onChange={(ev) => this.onInputChange(this, ev)} />
                    <Button className={classes.inputButton} type="submit" color="primary">Login</Button>
                </form>
            </div>
        );
    }
}

export default withStyles((theme) => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        color: "white",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    inputButton: {
        color: theme.palette.primary[200]
    }
}))(CredentialForm);