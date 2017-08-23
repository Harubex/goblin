import React from "react";
import PropTypes from "prop-types";

export default class CardImage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            url: "../cardback.png"
        };
    }
              
    render() {
        return (
            <img className="card-image" src={this.props.url || this.state.url} />
        );
    }
}

CardImage.propTypes = {
    width: PropTypes.string
};

CardImage.defaultProps = {
    width: "250px"
}