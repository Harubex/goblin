import React from "react";
import PropTypes from "prop-types";

export default class CardImage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            url: "/cardback.png"
        };
    }
              
    render() {
        return (
            <div className="card-image-container">
                <img className={`${this.props.className} card-image`} src={this.props.url} style={{width: this.props.width, background: "url('/cardback.png') no-repeat"}} />
            </div>
        );
    }
}

CardImage.propTypes = {
    width: PropTypes.string
};

CardImage.defaultProps = {
    width: "250px"
}