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
                {this.props.cardData.name} <br/><br/>
                <CardImage url={""} />
                <ManaText content={this.props.cardData.oracle_text} /><br/><br/>
                <a href={"/card/" + this.props.cardData.set + "/" + (parseInt(this.props.cardData.collector_number) - 1)}>Previous</a>
                <a href={"/card/" + this.props.cardData.set + "/" + (parseInt(this.props.cardData.collector_number) + 1)}>Next</a>
            </div>
        );
    }
}