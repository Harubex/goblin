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
            <div className="container">
                {this.props.context.from && <a href={"/collections/" + this.props.context.from + "/" + this.props.context.card.set}>Back to Collection</a>}
                {this.props.context.card.name} <br/><br/>
                <CardImage url={""} />
                <ManaText content={this.props.context.card.oracle_text} /><br/><br/>
                <a href={"/card/" + this.props.context.card.set + "/" + (parseInt(this.props.context.card.collector_number) - 1)}>Previous</a>
                <a href={"/card/" + this.props.context.card.set + "/" + (parseInt(this.props.context.card.collector_number) + 1)}>Next</a>
            </div>
        );
    }
}