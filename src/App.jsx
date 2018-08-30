import React from "react";
import ReactDOM from "react-dom";
import CardProfile from "./CardProfile";
import Collections from "./Collections";
import Collection from "./Collection";
import Cards from "./Cards";
import ImportExport from "./ImportExport";
import CredentialForm from "./CredentialForm";
import fetch from "./utils/fetch";
import HeaderBar from "./components/navigation/HeaderBar";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }
    
    async componentDidMount() {
        await this.getMethods();
    }

    onLogged(ctx, state) {
        ctx.setState({
            currentUser: state.name
        });
    }

    /**
     * @returns {any[]}
     */
    async getMethods() {
        const resp = await fetch(`/test`, "get", (e, r) => {
            this.setState({
                methods: r
            });
        });
    }

    render() {
        return (
            <div>
                <HeaderBar session={this.props.session} title={"Sample Text"} username={"miorni"} />
                <select>
                    {(this.state.methods || []).map(val => <option>{val}</option>)}
                </select>
            </div>
        );
    }
}