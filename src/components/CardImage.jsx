import React from "react";
import PropTypes from "prop-types";

export default class CardImage extends React.Component ***REMOVED*** 
    constructor(props) ***REMOVED***
        super(props);
        this.state = ***REMOVED***
            url: "/cardback.png"
        ***REMOVED***;
    ***REMOVED***
              
    render() ***REMOVED***
        return (
            <div className="card-image-container" style=***REMOVED******REMOVED***width: this.props.width***REMOVED******REMOVED***>
                <img className="card-image" src=***REMOVED***this.props.url***REMOVED*** />
            </div>
        );
    ***REMOVED***
***REMOVED***

CardImage.propTypes = ***REMOVED***
    width: PropTypes.string
***REMOVED***;

CardImage.defaultProps = ***REMOVED***
    width: "250px"
***REMOVED***