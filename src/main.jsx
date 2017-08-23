import React from "react";
import ReactDOM from "react-dom";
import ***REMOVED*** AppContainer ***REMOVED*** from "react-hot-loader";
import ***REMOVED*** BrowserRouter ***REMOVED*** from "react-router-dom";

import App from "./App";

const serverState = window.serverState;

delete window.serverState;

ReactDOM.render((
    <AppContainer>
            <BrowserRouter>
                <App context=***REMOVED***serverState***REMOVED*** />
            </BrowserRouter>
    </AppContainer>
), document.getElementById("base-container"));