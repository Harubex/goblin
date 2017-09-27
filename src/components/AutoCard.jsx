import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import ManaCost from "./ManaCost";

class AutoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            cards: [],
            suggestions: []
        };
        this.fetchCards("", (cardData) => {
            this.setState({
                cards: cardData
            });
        });
    }

    fetchCards(input, cb) {
        fetch(`/card/autocomplete?name=${input}`).then((resp) => resp.json()).then((json) => {
            cb(json);
        });
    }

    renderSuggestion(suggestion) {
        return (
            <div>
                <p>{suggestion.name}</p>
                <div>{suggestion.type_line} <ManaCost sym={suggestion.mana_cost} /></div>
            </div>
        );
    }

    getSuggestions(ctx, value, inputData) {
        let val = value.toLowerCase();
        let cardData = ctx.state.cards.length > 0 ? ctx.state.cards : inputData;
        return cardData.filter((card) => {
            return card.name.toLowerCase().indexOf(val) >= 0;
        });
    }

    onInputChange(ctx, ev, newValue) {
        ctx.setState({
            value: newValue
        });
    }

    getSuggestionValue(suggestion) {
        return suggestion.name;
    }

    fetchSuggestions(ctx, value) {
        if (!value || value.length < 3) {
            ctx.setState({
                suggestions: []
            });
        } else if (ctx.state.cards.length > 0) {
            ctx.setState({
                suggestions: ctx.getSuggestions(ctx, value)
            });
        } else {
            this.fetchCards(value, (cardData) => {
                ctx.setState({
                    suggestions: ctx.getSuggestions(ctx, value, cardData)
                });
            });
        }
    }

    clearSuggestions(ctx) {
        ctx.setState({
            suggestions: []
        });
    };
    
    render() {
        const classes = this.props.classes;
        return (
            <Autosuggest 
                theme={{
                    suggestionsList: classes.cardList,
                    suggestion: classes.cardOption,
                    suggestionHighlighted: classes.hoveredOption
                }}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={({value}) => this.fetchSuggestions(this, value)}
                onSuggestionsClearRequested={() => this.clearSuggestions(this)}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                    placeholder: "Enter a card name",
                    value: this.state.value,
                    onChange: (ev, {newValue}) => this.onInputChange(this, ev, newValue)
                }}
            />
        );
    }
}

export default withStyles({
    cardList: {
        listStyle: "none",
        paddingLeft: 0
    },
    cardOption: {
        borderTop: "1px solid white",
        borderBottom: "1px solid black",
        margin: 0,
        cursor: "pointer"
    },
    hoveredOption: {
        backgroundColor: "lightblue"
    }
})(AutoCard);