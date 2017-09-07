import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import CardGlance from "./components/CardGlance";

class Cards extends React.Component {

    render() {
        const classes = this.props.classes;
        return (
            <div className={`${classes.card_container} container`}>
                {this.props.context.cardData.map((card) => (
                    <CardGlance key={uuid()} collectionId={this.props.context.collectionId} name={card.name} image_uri={card.image_uri} usd={card.usd} code={card.set} num={card.collector_number} />
                ))}
            </div>
        );
    }
}

export default withStyles({
    card_container: {
        textAlign: "center"
    }
})(Cards);