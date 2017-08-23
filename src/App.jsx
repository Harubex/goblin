import React from "react";
import ReactDOM from "react-dom";

export default class App extends React.Component ***REMOVED***

    constructor(props) ***REMOVED***
        super(props);
    ***REMOVED***

    render() ***REMOVED***
        return (
            <div>
                ***REMOVED***this.props.context.name***REMOVED***
                <img src=***REMOVED***this.props.context.image_uri***REMOVED*** />
                <div>***REMOVED***this.props.context.oracle_text***REMOVED***</div>
                <a href=***REMOVED***"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) - 1)***REMOVED***>Previous</a>
                <a href=***REMOVED***"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) + 1)***REMOVED***>Next</a>
            </div>
        );
    ***REMOVED***
***REMOVED***