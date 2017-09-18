import React from "react";
import ReactDOM from "react-dom";
import CardProfile from "./CardProfile";
import Collections from "./Collections";
import Collection from "./Collection";
import Cards from "./Cards";
import HeaderBar from "./components/HeaderBar";
import { Route } from "react-router-dom";

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderBar currentUser={null} />
                <Route path="/card/:set/:code" render={() => <CardProfile context={this.props.context} />} />
                <Route path="/collections" exact render={() => <Collections collectionData={this.props.context} />} />
                <Route path="/collections/:id" exact render={() => <Collection context={this.props.context} />} />
                <Route path="/collections/:id/:code" render={() => <Cards context={this.props.context} />} />
            </div>
        );
    }
}