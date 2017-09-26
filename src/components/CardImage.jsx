import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

class CardImage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            url: "/cardback.png"
        };
    }
              
    render() {
        styles.cardImage.width = this.props.width;
        const classes = this.props.classes;
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

let styles = {
    cardImage: {
        width: CardImage.defaultProps.width
    }
};

export default withStyles(styles)(CardImage);