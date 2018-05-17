import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog, {DialogTitle, DialogContent, DialogActions, DialogContentText} from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import CollectionCard from "./components/CollectionCard";
import AddButton from "./components/AddButton";
import DialogButton from "./components/generic/DialogButton";
import fetch from "./utils/fetch";

class Collections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionData: this.props.collectionData,
            collectionName: "",
            error: false
        };
    }

    inputChange(ctx, ev, eleName) {
        ctx.setState({
            [eleName]: ev.target.value
        });
    }

    createCollection(ctx) {
        fetch("/collections/add", "post", { 
            collectionName: ctx.state.collectionName 
        }, (err, json) => {
            if (err) {
                ctx.setState({
                    error: err.message
                });
            } else {
                ctx.setState({ 
                    collectionData: ctx.state.collectionData.concat(Object.assign(json.data, {
                        size: 0
                    }))
                });
            }
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <div className={`${classes.collectionContainer} container`}>
                    {this.state.collectionData.map((collection) => (
                        <CollectionCard key={uuid()} id={collection.id} name={collection.name} 
                            size={collection.size} total_value={collection.total_value} />
                    ))}
                    <DialogButton dialogTitle={"Create a new collection"} dialogContent={(
                        <React.Fragment>
                            <DialogContentText className={classes.dialogText}>
                                Provide a name for the new collection.
                            </DialogContentText>
                            <TextField id="collectionName" className={classes.nameInput} 
                                placeholder="Collection Name"
                                value={this.state.newCollectionName}
                                onChange={(ev) => this.inputChange(this, ev, "collectionName")} />
                        </React.Fragment>
                    )} doneText="Add" dialogDone={() => this.createCollection(this)} />
                </div>
                <Dialog className={this.state.error ? classes.shown : classes.hidden} open={!!this.state.error} 
                        onClose={() => this.setState({ error: false })}>
                    <DialogTitle>Collection creation failed</DialogTitle>
                        <DialogContent>
                            <DialogContentText className={classes.dialogText}>
                                {this.state.error}
                            </DialogContentText>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ error: false })} color="primary">
                            Okay
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles({
    collectionContainer: {
        textAlign: "center"
    },
    nameInput: {
        width: "100%",
        marginTop: "1em"
    },
    dialogText: {
        padding: "0.5em 0"
    },
    hidden: {
        display: "none"
    },
    shown: {
        display: "flex"
    }
})(Collections);