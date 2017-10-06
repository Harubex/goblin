import React from "react";
import ReactDOM from "react-dom";
import CardProfile from "./CardProfile";
import Collections from "./Collections";
import Collection from "./Collection";
import Cards from "./Cards";
import CredentialForm from "./CredentialForm";
import HeaderBar from "./components/HeaderBar";
import { Route } from "react-router-dom";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    onLogged(ctx, state) {
        ctx.setState({
            currentUser: state.name
        });
    }

    render() {
        return (
            <div>
                <HeaderBar session={this.props.session} />
                <Route path="/user/login" render={() => <CredentialForm formType="login" context={this.props.context} />} />
                <Route path="/user/register" render={() => <CredentialForm formType="register" context={this.props.context} />} />
                <Route path="/card/:set/:code" render={() => <CardProfile context={this.props.context} />} />
                <Route path="/collections" exact render={() => <Collections collectionData={this.props.context} />} />
                <Route path="/collections/:id" exact render={() => <Collection context={this.props.context} />} />
                <Route path="/collections/:id/:code" render={() => <Cards context={this.props.context} />} />
            </div>
        );
    }
}