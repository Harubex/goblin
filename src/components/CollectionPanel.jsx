import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import SetCard from "./SetCard";

class CollectionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        const classes = this.props.classes;
        return (
            <div className={`${classes.set_container} container`}>
                {this.props.sets.map((set) => {
                    if (set.visible) {
                        return (
                            <SetCard key={uuid()} id={this.props.collectionId} 
                                code={set.parent_set_code || set.code} 
                                name={set.name} 
                                size={set.card_count}
                                ownedCards={this.props.ownedCards[set.code] || 0} />
                        );
                    }
                })}
            </div>
        );
    }
}

CollectionPanel.propTypes = {
    sets: PropTypes.array.isRequired,
    ownedCards: PropTypes.object,
    collectionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

CollectionPanel.defaultProps = {
    sets: [],
    ownedCards: []
}

export default withStyles({
    set_container: {
        textAlign: "center"
    }
})(CollectionPanel);