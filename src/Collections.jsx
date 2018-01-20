import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import {withStyles} from "material-ui/styles";
import TextField from "material-ui/TextField";
import {DialogContentText} from "material-ui/Dialog";
import CollectionCard from "./components/CollectionCard";
import AddButton from "./components/AddButton";
import DialogButton from "./components/generic/DialogButton";
import fetch from "./utils/fetch";

class Collections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionData: this.props.collectionData,
            collectionName: ""
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
            ctx.setState({ 
                collectionData: ctx.state.collectionData.concat(Object.assign(json.data, {
                    size: 0
                }))
            });
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <div className={`${classes.collectionContainer} container`}>
                {this.state.collectionData.map((collection) => (
                    <CollectionCard key={uuid()} id={collection.id} name={collection.name} 
                        size={collection.size} total_value={collection.total_value} />
                ))}
                <DialogButton dialogTitle={"Create a new collection"} dialogContent={(
                    <React.Fragment>
                        <DialogContentText className={classes.dialogText}>Provide a name for the new collection.</DialogContentText>
                        <TextField id="collectionName" className={classes.nameInput} 
                            placeholder="Collection Name"
                            value={this.state.newCollectionName}
                            onChange={(ev) => this.inputChange(this, ev, "collectionName")} />
                    </React.Fragment>
                )} doneText="Add" dialogDone={() => this.createCollection(this)}/>
            </div>
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
    }
})(Collections);