import React from "react";
import ReactDOM from "react-dom";
import ManaText from "./components/ManaText";
import CardImage from "./components/CardImage";

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.context.name} <br/><br/>
                <CardImage url={this.props.context.image_uri} />
                <ManaText content={this.props.context.oracle_text} /><br/><br/>
                <a href={"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) - 1)}>Previous</a>
                <a href={"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) + 1)}>Next</a>
            </div>
        );
    }
}