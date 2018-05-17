import React from "react";
import uuid from "uuid/v4";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import AutoCard from "./AutoCard";
import fetch from "../utils/fetch";

class AddCardDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.addDialogOpen,
            autoCardId: uuid(),
            cardId: "",
            cardName: "",
            normalQty: "",
            foilQty: "",
            sets: []
        };
    }

    doneAdding(ctx) {
        ctx.props.onClose();
    }

    onAdd(ctx, cardId, cardName) {
        ctx.setState({
            cardId: cardId,
            cardName: cardName
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
            normalQty: ctx.state.normalQty || 0,
            foilQty: ctx.state.foilQty || 0,
            cardName: ctx.state.cardName
        };
        fetch(`/collections/${this.props.collectionId}/add`, "post", cardData, (err, json) => {
            ctx.props.onAdd(cardData);
            ctx.onInputChange(ctx, "cardId", "");
            let ele = document.getElementById(ctx.state.autoCardId);
            ele.focus();
            ele.value = "";
        });
    }

    keyPressed(ctx, ev) {
        if (ev.keyCode === 13 && !document.getElementById("suggestion-container")) { // enter
            ctx.addCards(ctx);
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <Dialog open={this.props.open} onClose={() => {this.doneAdding(this)}} disableBackdropClick 
                    onKeyDown={(ev) => this.keyPressed(this, ev)}>
                <DialogTitle className={classes.dialogContent}>Add New Cards</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <AutoCard id={this.state.autoCardId} collectionId={this.props.collectionId}disableBackdropClickdisableBackdropClick 
                        onAdd={(cardId, cardName) => this.onAdd(this, cardId, cardName)} />
                    <TextField id="normalQty" label="Normal Quantity" value={this.state.normalQty} className={classes.qtyInput}
                        onChange={(ev) => this.onInputChange(this, "normalQty", ev.target.value)} margin="normal" />
                    <TextField id="foilQty" label="Foil Quantity" value={this.state.foilQty} className={classes.qtyInput}
                        onChange={(ev) => this.onInputChange(this, "foilQty", ev.target.value)} margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={() => this.addCards(this)}>
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