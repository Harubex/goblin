import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const serverState = window.serverState;

delete window.serverState;

ReactDOM.render((
    <BrowserRouter>
        <App context={serverState} />
    </BrowserRouter>
), document.getElementById("base-container"));