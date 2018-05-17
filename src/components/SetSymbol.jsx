import React from "react";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

class SetSymbol extends React.Component {
    render() {
        const setIcon = <Icon className={`${this.props.className} set-symbol ss ss-${this.props.setCode} ${this.props.rarity != "common" && this.props.gradient && 'ss-grad'} ${this.props.rarity && 'ss-' + this.props.rarity} ${'ss-' + this.props.size + 'x'}`} style={{marginTop: "-2px"}} />;
        return this.props.url ? (
            <img className={setIcon.props.className} src={this.props.url} />
        ) : (
            setIcon
        );
    }
}

SetSymbol.propTypes = {
    url: PropTypes.string,
    setCode: PropTypes.string.isRequired,
    rarity: PropTypes.string,
    gradient: PropTypes.bool,
    size: PropTypes.number
};

SetSymbol.defaultProps = {
    setCode: "none",
    rarity: "common",
    gradient: false,
    size: 1
}

export default withStyles({
})(SetSymbol);