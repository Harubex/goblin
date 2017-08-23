import React from "react";
import ReactDOM from "react-dom";

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.context.name}
                <img src={this.props.context.image_uri} />
                <div>{this.props.context.oracle_text}</div>
                <a href={"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) - 1)}>Previous</a>
                <a href={"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) + 1)}>Next</a>
            </div>
        );
    }
}