import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const serverState = window.serverState;

delete window.serverState;

ReactDOM.render((
    <AppContainer>
            <BrowserRouter>
                <App context={serverState} />
            </BrowserRouter>
    </AppContainer>
), document.getElementById("base-container"));