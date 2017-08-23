import React from "react";
import uuid from "uuid/v4";
import PropTypes from "prop-types";

export default class ManaCost extends React.Component ***REMOVED***
    render() ***REMOVED***
        return (
            <div className="mana-cost">
                ***REMOVED***this.decodeCost(this.props.sym).map((sym) => ( 
                    <span key=***REMOVED***uuid()***REMOVED*** className=***REMOVED***`mana $***REMOVED***this.props.size || "small"***REMOVED*** shadow s$***REMOVED***sym***REMOVED***`***REMOVED***></span> 
                ))***REMOVED***
            </div>
        );
    ***REMOVED***

    /**
     * Receives a string of mana symbols and parses them into an array.
     * @param ***REMOVED***string***REMOVED*** costText - The text to decode. Invalid options will cause an empty array to be returned.
     * @return ***REMOVED***string[]***REMOVED*** - A list of symbols in the given string.
     */
    decodeCost(costText) ***REMOVED***
        let symbols = [];
        if (costText && typeof(costText) === "string") ***REMOVED***
            symbols = costText.match(/([A-Z\/0-9]+)/gi).map((symText) => ***REMOVED***
                if (!symText) ***REMOVED***
                    throw new Error(`No image was found for symbol text $***REMOVED***symText***REMOVED***.`);
                ***REMOVED***
                return symText.toLowerCase().replace("/", ""); 
            ***REMOVED***);
        ***REMOVED***
        return symbols;
    ***REMOVED***
***REMOVED***

ManaCost.propTypes = ***REMOVED***
    costText: PropTypes.string
***REMOVED***