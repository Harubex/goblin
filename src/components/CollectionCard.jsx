import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Card, { CardHeader, CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";
import ModeEditIcon from "material-ui-icons/ModeEdit";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import DeleteIcon from "material-ui-icons/Delete";

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
    }
});

class CollectionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            deleteDialogOpen: false,
            deleted: false
        };
    }

    handleExpandClick(context) {    
        context.setState({
            expanded: !context.state.expanded
        });
    }

    editCollection(context) {
    }

    deleteCollection(context) {
        context.setState({
            deleteDialogOpen: true
        });
    }

    closeDialog(context) {
        context.setState({
            deleteDialogOpen: false
        });
    }

    confirmDelete(context) {
        fetch(new Request(`/collections/${context.props.id}`, {
            method: "DELETE"
        }));
        context.setState({
            deleted: true
        });
        context.closeDialog(context);
    }

    render() {
        const classes = this.props.classes;
        return (
            <div style={{display: "inline-block"}}>
                <Card className={classes.card} style={{display: this.state.deleted ? "none" : ""}}>
                    <a className={classes.cardInfo} href={`/collections/${this.props.id}`}>
                        <CardHeader className={classes.title} 
                            title={this.props.name}
                            subheader={`${this.props.size} Card${this.props.size != 1 ? "s" : ""}`} />
                        <CardContent>
                            <Typography type="body1" className={classes.pos}>
                                
                            </Typography>
                        </CardContent>
                    </a>
                    <CardActions className={classes.actions}>
                        <IconButton color="primary" className={classes.button} onClick={() => {this.editCollection(this)}}>
                            <ModeEditIcon />
                        </IconButton>
                        <IconButton color="accent" className={classes.button} onClick={() => {this.deleteCollection(this)}}>
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Card>
                <Dialog open={this.state.deleteDialogOpen} onRequestClose={() => {this.closeDialog(this)}}>
                    <DialogTitle>Delete {this.props.name}</DialogTitle>
                    <DialogContent>Are you sure you want to delete this collection?</DialogContent>
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