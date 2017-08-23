import React from "react";
import PropTypes from "prop-types";

export default class CardImage extends React.Component ***REMOVED*** 
    constructor(props) ***REMOVED***
        super(props);
        this.state = ***REMOVED***
            url: "../cardback.png"
        ***REMOVED***;
    ***REMOVED***
              
    render() ***REMOVED***
        return (
            <img className="card-image" src=***REMOVED***this.props.url || this.state.url***REMOVED*** />
        );
    ***REMOVED***
***REMOVED***

CardImage.propTypes = ***REMOVED***
    width: PropTypes.string
***REMOVED***;

CardImage.defaultProps = ***REMOVED***
    width: "250px"
***REMOVED***