import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import CollectionCard from "./components/CollectionCard";

class Collections extends React.Component {

    render() {
        const classes = this.props.classes;
        return (
            <div className={`${classes.collection_container} container`}>
                {this.props.collectionData.map((collection) => (
                    <CollectionCard key={uuid()} id={collection.id} name={collection.name} size={collection.size} />
                ))}
            </div>
        );
    }
}

export default withStyles({
    collection_container: {
        textAlign: "center"
    }
})(Collections);