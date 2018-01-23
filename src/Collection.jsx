import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import CollectionPanel from "./components/CollectionPanel";
import Switch from "material-ui/Switch";

class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTokens: false
        }
        this.toggleTokens = this.toggleTokens.bind(this);
    }

    toggleTokens(event, checked) {
        this.setState({
            showTokens: checked
        });
        this.props.context.sets = this.props.context.sets.map((ele) => {
            ele.visible = Math.random() > 0.5;
            return ele;
        });
    }

    render() {
        const classes = this.props.classes;
        const ctx = this.props.context || {};
        return (
            <React.Fragment>
                <div>
                    <Switch checked={this.state.showTokens} onChange={this.toggleTokens} />
                </div>
                <CollectionPanel collectionId={ctx.collectionId} sets={ctx.sets} ownedCards={ctx.ownedCards} />
            </React.Fragment>
        );
    }
}

export default withStyles({
    set_container: {
        textAlign: "center"
    }
})(Collection);