import React from "react";
import ReactDOM from "react-dom";
import CardProfile from "./CardProfile";
import Collections from "./Collections";
import HeaderBar from "./components/HeaderBar";
import { Route } from "react-router-dom";

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderBar />
                <Route path="/card/:set/:code" render={() => <CardProfile cardData={this.props.context} />} />
                <Route path="/collections" render={() => <Collections collectionData={this.props.context} />} />
            </div>
        );
    }
}