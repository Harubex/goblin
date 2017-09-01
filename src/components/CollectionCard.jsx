import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";

const styles = theme => ({
    card: {
        display: "inline-block",
        width: 250,
        height: 140,
        textAlign: "center",
        textDecoration: "none",
        margin: "6px 10px"
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
        color: theme.palette.text.secondary,
    },
    pos: {
        marginBottom: 12,
        color: theme.palette.text.secondary,
    }
});

class CollectionCard extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <a href={`/collections/${this.props.id}`}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography type="body1" className={classes.title}>
                            {this.props.name}
                        </Typography>
                        <Typography type="body1" className={classes.pos}>
                            {this.props.size} Card{this.props.size != 1 ? "s" : ""}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
}

CollectionCard.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

CollectionCard.defaultProps = {
    size: 0
}

export default withStyles(styles)(CollectionCard);