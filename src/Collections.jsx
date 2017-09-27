import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import {withStyles} from "material-ui/styles";
import CollectionCard from "./components/CollectionCard";
import AddButton from "./components/AddButton";
import DialogButton from "./components/generic/DialogButton";
import TextField from "material-ui/TextField";
import {DialogContentText} from "material-ui/Dialog";

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
        fetch(new Request(`/collections/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                collectionName: ctx.state.collectionName
            })
        })).then((resp) => resp.json()).then((json) => {
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
            <div className={`${classes.collection_container} container`}>
                {this.props.collectionData.map((collection) => (
                    <CollectionCard key={uuid()} id={collection.id} name={collection.name} size={collection.size} />
                ))}
                <DialogButton dialogTitle={"Create a new collection"} dialogContent={(
                    <div>
                        <p>Provide a name for the new collection.</p>
                        <TextField id="collectionName" className={classes.nameInput} 
                            placeholder="Collection Name"
                            value={this.state.newCollectionName}
                            onChange={(ev) => this.inputChange(this, ev, "collectionName")} />
                    </div>
                )} doneText="Add" dialogDone={() => this.createCollection(this)}/>
            </div>
        );
    }
}

export default withStyles({
    collection_container: {
        textAlign: "center"
    },
    nameInput: {
        width: "100%"
    }
})(Collections);