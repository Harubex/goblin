import React from "react";
import PropTypes from "prop-types";
import ***REMOVED*** CommandBar ***REMOVED*** from "office-ui-fabric-react/lib/CommandBar";

export default class HeaderBar extends React.Component ***REMOVED*** 
    constructor(props) ***REMOVED***
        super(props);
    ***REMOVED***
              
    render() ***REMOVED***
        return (
            <CommandBar items=***REMOVED***[
                ***REMOVED***         
                    key: "card-item",
                    name: "Card Search",
                    className: "ms-CommandBarItem",
                    href: "/cards",
                    iconProps: ***REMOVED***
                        iconName: "Mail"
                    ***REMOVED***
                ***REMOVED***,
                ***REMOVED***         
                    key: "collection-item",
                    name: "Collection Manager",
                    className: "ms-CommandBarItem",
                    href: "/collections"
                ***REMOVED***,
                ***REMOVED***         
                    key: "builder-item",
                    name: "Deck Builder",
                    className: "ms-CommandBarItem",
                    href: "/builder"
                ***REMOVED***,
            ]***REMOVED*** farItems=***REMOVED***[
                ***REMOVED***         
                    key: "login-item",
                    name: "Login",
                    className: "ms-CommandBarItem",
                    href: "/login"
                ***REMOVED***,
                ***REMOVED***         
                    key: "register-item",
                    name: "Register",
                    className: "ms-CommandBarItem",
                    href: "/register"
                ***REMOVED***,
            ]***REMOVED*** />
        );
    ***REMOVED***
***REMOVED***
