import React from "react";
import uuid from "uuid/v4";
import PropTypes from "prop-types";

export default class ManaCost extends React.Component {
    render() {
        return (
            <div className="mana-cost">
                {this.decodeCost(this.props.sym).map((sym) => ( 
                    <span key={uuid()} className={`mana ${this.props.size || "small"} shadow s${sym}`}></span> 
                ))}
            </div>
        );
    }

    /**
     * Receives a string of mana symbols and parses them into an array.
     * @param {string} costText - The text to decode. Invalid options will cause an empty array to be returned.
     * @return {string[]} - A list of symbols in the given string.
     */
    decodeCost(costText) {
        let symbols = [];
        if (costText && typeof(costText) === "string") {
            symbols = costText.match(/([A-Z\/0-9]+)/gi).map((symText) => {
                if (!symText) {
                    throw new Error(`No image was found for symbol text ${symText}.`);
                }
                return symText.toLowerCase().replace("/", ""); 
            });
        }
        return symbols;
    }
}

ManaCost.propTypes = {
    costText: PropTypes.string
}