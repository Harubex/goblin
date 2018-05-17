import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import List, {ListItem, ListItemText, ListItemIcon} from "@material-ui/core/List";
import { SvgIcon } from "@material-ui/core/SvgIcon";
import SetSymbol from "./SetSymbol";

class SetSelector extends React.Component { 
    constructor(props) {
        super(props);
    }
              
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <List>
                    {this.props.sets.map((ele) => (
                        <ListItem key={ele.id} button onClick={() => this.props.onSetChosen(ele.id, ele.set_name)}>
                            <ListItemIcon>
                                <SetSymbol setCode={ele.code} size={2} rarity={ele.rarity} />
                            </ListItemIcon>
                            <ListItemText primary={ele.set_name} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

SetSelector.propTypes = {
    sets: PropTypes.array
};

export default withStyles((theme) => ({
    root: {
        width: "100%",
        paddingBottom: "1em",
    },
    menuLink: {
        textDecoration: "none",
        color: "black",
    },
    leftItems: {
        flex: 1
    },
    rightItems: {
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    }
}))(SetSelector);