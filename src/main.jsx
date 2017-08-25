import React from "react";
import ReactDOM from "react-dom";
import ***REMOVED*** AppContainer ***REMOVED*** from "react-hot-loader";
import ***REMOVED*** BrowserRouter ***REMOVED*** from "react-router-dom";
import ***REMOVED*** Fabric ***REMOVED*** from "office-ui-fabric-react";

import App from "./App";

const serverState = window.serverState;

delete window.serverState;

ReactDOM.render((
    <AppContainer>
            <BrowserRouter>
                <Fabric>
                    <App context=***REMOVED***serverState***REMOVED*** />
                </Fabric>
            </BrowserRouter>
    </AppContainer>
), document.getElementById("base-container"));