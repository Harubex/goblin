import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import CollectionCard from "./components/CollectionCard";

class Collection extends React.Component {

    render() {
        const classes = this.props.classes;
        return (
            <div className={`${classes.set_container} container`}>
                {this.props.collectionData.map((collection) => (
                    <CollectionCard key={uuid()} id={collection.id} name={collection.name} size={collection.size} />
                ))}
            </div>
        );
    }
}

export default withStyles({
    set_container: {
        textAlign: "center"
    }
})(Collection);