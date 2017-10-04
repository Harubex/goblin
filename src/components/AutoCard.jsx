import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from 'material-ui/Paper';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import ManaCost from "./ManaCost";
import SetSymbol from "./SetSymbol";

class AutoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            cardId: "",
            cards: [],
            sets: [],
            suggestions: [],
            id: this.props.id || uuid()
        };
        this.fetchCards("", (cardData) => {
            this.setState({
                cards: cardData
            });
        });
    }

    componentDidMount() {
        //document.querySelector("." + this.props.classes.suggestInput).focus();
    }

    fetchCards(input, cb) {
        fetch(`/card/autocomplete?name=${input}`).then((resp) => resp.json()).then((json) => {
            cb(json);
        });
    }

    renderInput(inputProps) {
        const { classes, autoFocus, placeholder, value, ref, onChange } = inputProps;
        return <TextField
            autoFocus={autoFocus}
            className={classes.textField}
            placeholder={placeholder}
            value={value}
            inputRef={ref}
            InputProps={Object.assign({
                classes: {
                    input: classes.textField,
                }
            }, inputProps)}
        />;
    }

    renderSuggestionsContainer(options) {
        const { containerProps, children } = options;
        
          return (
            <Paper {...containerProps} square>
              {children}
            </Paper>
          );
    }

    renderSuggestion(suggestion, {query, isHighlighted}) {
        /*
        return (
            <div>
                <p>{suggestion.name}</p>
                <div>{suggestion.type_line || frontFace.type_line} <ManaCost sym={suggestion.mana_cost || frontFace.mana_cost} /></div>
            </div>
        );*/
        let frontFace = suggestion.card_faces ? suggestion.card_faces[0] : suggestion;
        const matches = match(frontFace.name, query);
        const parts = parse(frontFace.name, matches);
      
        return (
          <MenuItem style={{display: "block", height: "50px", lineHeight: 0}} selected={isHighlighted} component="div">
            <p>
              {parts.map((part, index) => {
                return part.highlight ? (
                  <span key={index} style={{ fontWeight: 300 }}>
                    {part.text}
                  </span>
                ) : (
                  <strong key={index} style={{ fontWeight: 500 }}>
                    {part.text}
                  </strong>
                );
              })}
            </p>
            <div>{suggestion.type_line || frontFace.type_line} <ManaCost sym={suggestion.mana_cost || frontFace.mana_cost} /></div>
          </MenuItem>
        );
    }

    getSuggestions(ctx, value, inputData) {
        let val = value.toLowerCase();
        let cardData = ctx.state.cards.length > 0 ? ctx.state.cards : inputData;
        return cardData.filter((card) => {
            return card.name.toLowerCase().indexOf(val) >= 0;
        });
    }

    onInputChange(ctx, valueName, newValue) {
        ctx.setState({
            [valueName]: newValue
        });
    }

    getSuggestionValue(ctx, suggestion) {
        let name = suggestion.name;
        fetch(`/card/sets?name=${name}`).then((resp) => resp.json()).then((json) => {
            let defaultId = json[0].id
            ctx.setState({
                cardId: defaultId,
                sets: json
            });      
            ctx.props.onAdd(defaultId);
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

    setChosen(ctx, cardId, setName) {
        ctx.state.cardId = cardId;
        ctx.setState({
            value: ctx.state.value + ` (${setName})`
        });
        ctx.clearSets(ctx);
    }
    
    clearValues(ctx) {
        ctx.setState({
            sets: [],
            cardId: "",
            value: ""
        });
    }

    clearSets(ctx) {
        ctx.setState({
            sets: []
        });
    }
    
    render() {
        const classes = this.props.classes;
        const props = {
            placeholder: "Enter a card name",
            value: this.state.value,
            classes: classes,
            autoFocus: true,
            onChange: (ev, {newValue}) => this.onInputChange(this, "value", newValue)
        };
        return (
            <div>
                <Autosuggest id={this.state.id}
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.cardList,
                        suggestion: classes.cardOption,
                        suggestionHighlighted: classes.hoveredOption,
                        input: classes.suggestInput
                    }}
                    renderInputComponent={this.renderInput}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={({value}) => this.fetchSuggestions(this, value)}
                    onSuggestionsClearRequested={() => this.clearSuggestions(this)}
                    getSuggestionValue={(value) => this.getSuggestionValue(this, value)}
                    renderSuggestionsContainer={this.renderSuggestionsContainer}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={props}
                />
                <Dialog open={this.state.sets.length > 0} onRequestClose={() => this.clearSets(this)}>
                    <DialogTitle className={classes.dialogContent}>Select Card Set</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        {this.state.sets.map((ele) => (
                            <div key={ele.id} className={classes.setOption} onClick={() => this.setChosen(this, ele.id, ele.set_name)}>
                                <SetSymbol setCode={ele.code} /> {ele.set_name}
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button color="accent" onClick={() => this.clearSets(this)}>
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

export default withStyles((theme) => ({
    container: {
        flex: 1,
        minHeight: 100
    },
    suggestionsContainerOpen: {
        position: "absolute",
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
        zIndex: 2
    },
    suggestInput: {
        width: "100%"
    },
    cardList: {
        listStyleType: "none",
        padding: 0,
        margin: 0
    },
    cardOption: {
        display: 'block',
       /* borderTop: "1px solid white",
        borderBottom: "1px solid black",
        margin: 0,
        cursor: "pointer",
        padding: "0 5px"*/
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
    },
    textField: {
        width: "100%"
    }
}))(AutoCard);