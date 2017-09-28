import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import ManaCost from "./ManaCost";
import SetSymbol from "./SetSymbol";

class AutoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            cards: [],
            sets: [],
            suggestions: [],
            id: uuid()
        };
        this.fetchCards("", (cardData) => {
            this.setState({
                cards: cardData
            });
        });
    }

    componentDidMount() {
        document.querySelector("." + this.props.classes.suggestInput).focus();
    }

    fetchCards(input, cb) {
        fetch(`/card/autocomplete?name=${input}`).then((resp) => resp.json()).then((json) => {
            cb(json);
        });
    }

    renderSuggestion(suggestion) {
        let frontFace = suggestion.card_faces ? suggestion.card_faces[0] : {}
        return (
            <div>
                <p>{suggestion.name}</p>
                <div>{suggestion.type_line || frontFace.type_line} <ManaCost sym={suggestion.mana_cost || frontFace.mana_cost} /></div>
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

    getSuggestionValue(ctx, suggestion) {
        let name = suggestion.name;
        fetch(`/card/sets?name=${name}`).then((resp) => resp.json()).then((json) => {
            ctx.setState({
                sets: json
            });
        });
        return name;
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

    setChosen(ctx, cardId) {
        fetch(new Request("/collection/1/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cardId: cardId,
                normalQty: 1,
                foilQty: 2
            })
        }));
        ctx.clearSets(ctx);
    }
    
    clearSets(ctx) {
        ctx.setState({
            sets: []
        });
    }
    
    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Autosuggest id={this.state.id}
                    theme={{
                        suggestionsList: classes.cardList,
                        suggestion: classes.cardOption,
                        suggestionHighlighted: classes.hoveredOption,
                        input: classes.suggestInput
                    }}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={({value}) => this.fetchSuggestions(this, value)}
                    onSuggestionsClearRequested={() => this.clearSuggestions(this)}
                    getSuggestionValue={(value) => this.getSuggestionValue(this, value)}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={{
                        placeholder: "Enter a card name",
                        value: this.state.value,
                        onChange: (ev, {newValue}) => this.onInputChange(this, ev, newValue)
                    }}
                />
                <Dialog open={this.state.sets.length > 0} onRequestClose={() => this.clearSets(this)}>
                    <DialogTitle className={classes.dialogContent}>Select Card Set</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        {this.state.sets.map((ele) => (
                            <div key={ele.id} className={classes.setOption} onClick={() => this.setChosen(this, ele.id)}>
                                <SetSymbol setCode={ele.code} /> {ele.set_name}
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.clearSets(this)} color="primary">
                            {"Cancel"}
                        </Button>
                        <Button color="primary">
                            {"Done"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles({
    suggestInput: {
        width: "100%"
    },
    cardList: {
        listStyle: "none",
        paddingLeft: 0
    },
    cardOption: {
        borderTop: "1px solid white",
        borderBottom: "1px solid black",
        margin: 0,
        cursor: "pointer",
        padding: "0 5px"
    },
    setOption: {
        padding: "5px 0",
        borderTop: "1px solid black",
        "&:hover": {
            backgroundColor: "lightblue",
            cursor: "pointer"
        }
    },
    hoveredOption: {
        backgroundColor: "lightblue"
    }
})(AutoCard);