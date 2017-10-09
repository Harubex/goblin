import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { LinearProgress } from "material-ui/Progress";
import SetSymbol from "./SetSymbol";

class SetCard extends React.Component {
    render() {
        const classes = this.props.classes;
        const owned = this.props.ownedCards || {
            cards: []
        };
        const totalCards = owned.cards.reduce((prev, curr) => {
            return prev += (curr.normal_qty || 0) + (curr.foil_qty || 0)
        }, 0);
        percentage = owned.cards.length / this.props.size
        return (
            <a href={`${this.props.id}/${this.props.code}`}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography type="body1" className={classes.title}>
                            {this.props.name}
                        </Typography>
                        <SetSymbol className={classes.symbol} setCode={this.props.code} size={4} />
                        <Typography type="body2" className={classes.pos}>
                            {owned.cards.length} / {this.props.size} Card{this.props.size != 1 ? "s" : ""}
                        </Typography>
                        <LinearProgress classes={{
                                primaryColor: classes.barColor,
                                primaryColorBar: classes.progressColor,
                            }} className={classes.progBar} mode="determinate" 
                            value={100 * percentage} />
                        <Typography type="body2" className={classes.pos}>
                            Total Cards Collected: {totalCards.toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
}

let percentage = 0;

SetCard.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

SetCard.defaultProps = {
    size: 0
}

let getBarColor = (function() {
    let red = {r: 193, g: 15, b: 15, a: 0.5};
    let yellow = {r: 255, g: 224, b: 22, a: 0.5};
    let green = {r: 8, g: 112, b: 46, a: 0.5};
    let lerp = (a, b, p) => (1 - p) * a + p * b;
    let colorLerp = (s, f, p) => {
        let ret = {};
        for (let k in s) {
            ret[k] = Math.round(lerp(s[k], f[k], p));
        }
        return `rgba(${ret.r}, ${ret.g}, ${ret.b}, ${ret.a})`;
    }
    return (percentage) => {
        if (percentage < .5) {
            return colorLerp(red, yellow, 2 * percentage);
        } else {
            return colorLerp(yellow, green, 2 * (percentage - .5));
        }
    }
}());

export default withStyles((theme) => ({
    progressColor: {
        backgroundColor: "rgb(8, 115, 46)"
    },
    barColor: {
        backgroundColor: "rgb(230, 15, 15)"
    },
    card: {
        display: "inline-block",
        width: 250,
        height: 225,
        textAlign: "center",
        textDecoration: "none",
        margin: "6px 10px"
    },
    progBar: {
        margin: 10,
        height: 8
    },
    title: {
        fontSize: 14,
        height: 40,
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    symbol: {
        padding: "10px"
    },
    pos: {
        color: theme.palette.text.secondary,
    }
}))(SetCard);