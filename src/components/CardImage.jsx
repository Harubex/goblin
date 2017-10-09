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

    imageLoaded(ctx) {
        ctx.setState({
            url: ctx.props.url
        });
    }
              
    render() {
        styles.cardImage.width = this.props.width;
        const classes = this.props.classes;
        return (
            <div className="card-image-container">
                <img className={`${this.props.className} card-image`} 
                onLoad={(ev) => this.imageLoaded(this, this.props.url)} src={this.state.url} 
                style={{width: this.props.width}} />
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