import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Card, { CardHeader, CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import ModeEditIcon from "material-ui-icons/ModeEdit";
import AddIcon from "material-ui-icons/Add";
import LayersClearIcon from "material-ui-icons/LayersClear";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import DeleteIcon from "material-ui-icons/Delete";
import Tooltip from "material-ui/Tooltip";
import AddCardDialog from "./AddCardDialog";
import fetch from "../utils/fetch";

const styles = (theme) => ({
    card: {
        display: "inline-block",
        textAlign: "center",
        margin: "6px 10px",
        minWidth: "250px"
    },
    cardInfo: {
        textDecoration: "none",
        textAlign: "center"
    },
    actions: { // move to overrides theme
        padding: 0,
        height: 30
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
        color: theme.palette.text.secondary,
    },
    pos: {
        marginBottom: 12,
        color: theme.palette.text.secondary,
    },
    media: {
        height: 194,
    },
    expand: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
        width: "100%"
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    flexGrow: {
        flex: "1 1 auto",
    },
    editOptions: { // move to overrides theme
        paddingBottom: 0,
        margin: 0
    },
    dialogContent: {
        fontFamily: "Roboto"
    }
});

class CollectionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            deleteDialogOpen: false,
            removeDialogOpen: false,
            deleted: false,
            addDialogOpen: false,
            collectionUnique: 0,
            collectionTotal: this.props.size
        };
    }

    handleExpandClick(context) {    
        context.setState({
            expanded: !context.state.expanded
        });
    }
    
    addToCollection(ctx) {
        ctx.setState({
            addDialogOpen: true
        });
    }

    editCollection(ctx) {
    }

    confirmRemove(ctx) {

    }

    deleteCollection(ctx) {
        ctx.setState({
            deleteDialogOpen: true
        });
    }

    closeDialog(ctx) {
        ctx.setState({
            removeDialogOpen: false,
            deleteDialogOpen: false,
            addDialogOpen: false
        });
    }

    removeCards(ctx) {
        ctx.setState({
            removeDialogOpen: true
        });
    }

    addCard(ctx, card) {
        ctx.setState({
            collectionTotal: parseInt(ctx.state.collectionTotal) + parseInt(card.normalQty) + parseInt(card.foilQty)
        });
    }

    confirmRemove(ctx) {
        fetch(`/collections/${ctx.props.id}/cards`, "delete");
        ctx.setState({
            collectionTotal: 0
        });
        ctx.closeDialog(ctx);
    }

    confirmDelete(ctx) {
        fetch(`/collections/${ctx.props.id}`, "delete");
        ctx.setState({
            deleted: true
        });
        ctx.closeDialog(ctx);
    }

    render() {
        const classes = this.props.classes;
        return (
            <div style={{display: "inline-block"}}>
                <Card className={classes.card} style={{display: this.state.deleted ? "none" : ""}}>
                    <a className={classes.cardInfo} href={`/collections/${this.props.id}`}>
                        <CardHeader className={classes.title} 
                            title={this.props.name}
                            subheader={`${this.state.collectionTotal} Card${this.state.collectionTotal != 1 ? "s" : ""}`} />
                        <CardContent>
                            <Typography type="body2" className={classes.pos}>
                                {`Collection Value: $${this.props.total_value.toFixed(2)}`}
                            </Typography>
                        </CardContent>
                    </a>
                    <CardActions className={classes.actions}>
                        <Tooltip className={classes.tooltip} placement="bottom" title="Add cards">
                            <IconButton color="accent" className={classes.button} onClick={() => {this.addToCollection(this)}}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip className={classes.tooltip} placement="bottom" title="Change name">
                            <IconButton color="primary" className={classes.button} onClick={() => {this.editCollection(this)}}>
                                <ModeEditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip className={classes.tooltip} placement="bottom" title="Delete collection">
                            <IconButton color="accent" className={classes.button} onClick={() => {this.deleteCollection(this)}}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip className={classes.tooltip} placement="bottom" title="Clear all cards from collection">
                            <IconButton color="primary" className={classes.button} onClick={() => {this.removeCards(this)}}>
                                <LayersClearIcon />
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                </Card>
                <Dialog open={this.state.removeDialogOpen} onClose={() => {this.closeDialog(this)}}>
                    <DialogTitle>Remove cards from {this.props.name}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>Are you sure you want to remove all cards from this collection?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.closeDialog(this)}} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {this.confirmRemove(this)}} color="accent">
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
                <AddCardDialog collectionId={this.props.id} open={this.state.addDialogOpen} 
                    onClose={() => this.closeDialog(this)} onAdd={(card) => this.addCard(this, card)}/>
                <Dialog open={this.state.deleteDialogOpen} onClose={() => {this.closeDialog(this)}}>
                    <DialogTitle>Delete {this.props.name}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>Are you sure you want to delete this collection?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.closeDialog(this)}} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {this.confirmDelete(this)}} color="accent">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

CollectionCard.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

CollectionCard.defaultProps = {
    size: 0
}

export default withStyles(styles)(CollectionCard);