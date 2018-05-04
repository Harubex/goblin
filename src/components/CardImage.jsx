import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import LazyLoad from "react-lazyload";

class CardImage extends React.Component { 
    constructor(props) {
        super(props);
    }
              
    render() {
        styles.cardImage.width = this.props.width;
        const classes = this.props.classes;
        return (
            <LazyLoad className={classes.cardImageContainer} height={"100%"} once offset={100} placeholder={<img className={`${this.props.className} card-image`} src="/cardback.png" />}>
                <img className={`${this.props.className} card-image`} src={`/card/images/${this.props.set}/${this.props.code}`}
                style={{width: this.props.width}} />
            </LazyLoad>
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
    },
    cardImageContainer: {
        height: "100%"
    }
};

export default withStyles(styles)(CardImage);