import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import SetSymbol from "./SetSymbol";

class SetCard extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <a href={`${this.props.id}/${this.props.code}`}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography type="body1" className={classes.title}>
                            {this.props.name}
                        </Typography>
                        <SetSymbol className={classes.symbol} setCode={this.props.code} size={2} />
                        <Typography type="body1" className={classes.pos}>
                            {this.props.size} Card{this.props.size != 1 ? "s" : ""}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
}

SetCard.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

SetCard.defaultProps = {
    size: 0
}

export default withStyles((theme) => ({
    card: {
        display: "inline-block",
        width: 250,
        height: 140,
        textAlign: "center",
        textDecoration: "none",
        margin: "6px 10px"
    },
    title: {
        fontSize: 14,
        color: theme.palette.text.secondary,
    },
    symbol: {
        padding: "10px"
    },
    pos: {
        color: theme.palette.text.secondary,
    }
}))(SetCard);