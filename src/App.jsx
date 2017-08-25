import React from "react";
import ReactDOM from "react-dom";
import ManaText from "./components/ManaText";
import CardImage from "./components/CardImage";
import HeaderBar from "./components/HeaderBar";

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderBar />
                {this.props.context.name} <br/><br/>
                <CardImage url={""} />
                <ManaText content={this.props.context.oracle_text} /><br/><br/>
                <a href={"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) - 1)}>Previous</a>
                <a href={"/card/" + this.props.context.set + "/" + (parseInt(this.props.context.collector_number) + 1)}>Next</a>
            </div>
        );
    }
}