import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import CardImage from "./CardImage";

class CardGlance extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <a href={`/card/${this.props.code}/${this.props.num}?from=${this.props.collectionId}`}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography type="body1" className={classes.title}>
                            {this.props.name}
                        </Typography>
                        <CardImage className={classes.cardImage} url={this.props.image_uri} width="100px" />
                        <Typography type="body1" className={classes.pos}>
                            ${this.props.usd}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
}

CardGlance.propTypes = {
    name: PropTypes.string.isRequired
}

CardGlance.defaultProps = {
    size: 0
}

export default withStyles((theme) => ({
    card: {
        display: "inline-block",
        width: 250,
        height: 225,
        textAlign: "center",
        textDecoration: "none",
        margin: "6px 10px"
    },
    title: {
        fontSize: 14,
        color: theme.palette.text.secondary,
    },
    cardImage: {
        margin: "10px"
    },
    pos: {
        color: theme.palette.text.secondary,
    }
}))(CardGlance);