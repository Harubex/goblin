import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import SetCard from "./components/SetCard";

class Collection extends React.Component {

    render() {
        const classes = this.props.classes;
        return (
            <div className={`${classes.set_container} container`}>
                {this.props.context.setData.map((set) => (
                    <SetCard key={uuid()} id={this.props.context.collectionId} code={set.parent_set_code || set.code} name={set.name} size={set.card_count} />
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