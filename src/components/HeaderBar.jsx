import React from "react";
import PropTypes from "prop-types";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";

export default class HeaderBar extends React.Component { 
    constructor(props) {
        super(props);
    }
              
    render() {
        return (
            <CommandBar items={[
                {         
                    key: "card-item",
                    name: "Card Search",
                    className: "ms-CommandBarItem",
                    href: "/cards",
                    iconProps: {
                        iconName: "Mail"
                    }
                },
                {         
                    key: "collection-item",
                    name: "Collection Manager",
                    className: "ms-CommandBarItem",
                    href: "/collections"
                },
                {         
                    key: "builder-item",
                    name: "Deck Builder",
                    className: "ms-CommandBarItem",
                    href: "/builder"
                },
            ]} farItems={[
                {         
                    key: "login-item",
                    name: "Login",
                    className: "ms-CommandBarItem",
                    href: "/login"
                },
                {         
                    key: "register-item",
                    name: "Register",
                    className: "ms-CommandBarItem",
                    href: "/register"
                },
            ]} />
        );
    }
}
