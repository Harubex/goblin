import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const serverState = window.serverState;
const sessionState = window.sessionState;

delete window.serverState;
delete window.sessionState;

ReactDOM.render((
    <React.StrictMode>
        <BrowserRouter>
            <App context={serverState} session={sessionState} />
        </BrowserRouter>
    </React.StrictMode>
), document.getElementById("base-container"));