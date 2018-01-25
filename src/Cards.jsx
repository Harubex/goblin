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
                    
                    <CardGlance key={uuid()} 
                        collectionId={this.props.context.collectionId} 
                        name={card.name}
                        normal_qty={card.normal_qty} 
                        foil_qty={card.foil_qty} 
                        num={card.collector_number}
                        image_uri={(card.card_faces && !card.image_uris) ? card.card_faces[0].image_uris.small : (
                            card.image_uris ? card.image_uris.small : card.image_uri
                        )}
                        usd={card.usd}
                        code={card.set} />
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