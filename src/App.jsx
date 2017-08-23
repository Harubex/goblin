import React from "react";
import ReactDOM from "react-dom";
import ManaText from "./components/ManaText";
import CardImage from "./components/CardImage";

export default class App extends React.Component ***REMOVED***

    constructor(props) ***REMOVED***
        super(props);
    ***REMOVED***

    render() ***REMOVED***
        return (
            <div>
                ***REMOVED***this.props.context.name***REMOVED*** <br/><br/>
                <CardImage url=***REMOVED***this.props.context.image_uri***REMOVED*** />
                <ManaText content=***REMOVED***this.props.context.oracle_text***REMOVED*** /><br/><br/>
                <a href=***REMOVED***"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) - 1)***REMOVED***>Previous</a>
                <a href=***REMOVED***"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) + 1)***REMOVED***>Next</a>
            </div>
        );
    ***REMOVED***
***REMOVED***