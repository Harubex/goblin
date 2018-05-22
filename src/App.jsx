import React from "react";
import ReactDOM from "react-dom";
import CardProfile from "./CardProfile";
import Collections from "./Collections";
import Collection from "./Collection";
import Cards from "./Cards";
import ImportExport from "./ImportExport";
import CredentialForm from "./CredentialForm";
import HeaderBar from "./components/navigation/HeaderBar";

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
                <HeaderBar session={this.props.session} title={"Sample Text"} username={"miorni"} />
            </div>
        );
    }
}