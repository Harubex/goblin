import React from "react";
import uuid from "uuid/v4";
import {withStyles} from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import AutoCard from "./AutoCard";

class AddCardDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.addDialogOpen,
            autoCardId: uuid(),
            cardId: "",
            normalQty: 0,
            foilQty: 0,
        };
    }

    doneAdding(ctx) {
        ctx.props.onClose();
    }

    onAdd(ctx, cardId) {
        ctx.setState({
            cardId: cardId
        });
    }
    onInputChange(ctx, valueName, newValue) {
        ctx.setState({
            [valueName]: newValue
        });
    }

    addCards(ctx) {
        let cardData = {
            cardId: ctx.state.cardId,
            normalQty: ctx.state.normalQty,
            foilQty: ctx.state.foilQty
        };
        fetch(new Request(`/collections/${this.props.collectionId}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                credentials: "same-origin"
            },
            body: JSON.stringify(cardData)
        })).then(() => {
            ctx.props.onAdd(cardData);
            ctx.onInputChange(ctx, "cardId", "");
            document.getElementById("react-autowhatever-" + ctx.state.autoCardId).focus();
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <Dialog open={this.props.open} onRequestClose={() => {this.doneAdding(this)}} ignoreBackdropClick>
                <DialogTitle className={classes.dialogContent}>Add New Cards</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <AutoCard id={this.state.autoCardId} collectionId={this.props.collectionId} 
                        onAdd={(cardId) => this.onAdd(this, cardId)} />
                    <TextField id="normalQty" label="Normal Quantity" value={this.state.normalQty} className={classes.qtyInput}
                        onChange={(ev) => this.onInputChange(this, "normalQty", ev.target.value)} margin="normal" />
                    <TextField id="foilQty" label="Foil Quantity" value={this.state.foilQty} className={classes.qtyInput}
                        onChange={(ev) => this.onInputChange(this, "foilQty", ev.target.value)} margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button color="accent" onClick={() => this.addCards(this)}>
                        {"Add"}
                    </Button>
                    <Button onClick={() => this.doneAdding(this)} color="primary">
                        {"Done"}
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
    },
    qtyInput: {
        margin: "0 10px"
    }
}))(AddCardDialog);