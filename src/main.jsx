import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import App from "./App";
const serverState = window.serverState;
const sessionState = window.sessionState;
 
delete window.serverState;
delete window.sessionState;

const theme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            light: "#e2f1f8",
            main: "#b0bec5",
            dark: "#808e95",
            contrastText: "#424242"
        },
        secondary: {
            light: "#82e9de",
            main: "#4db6ac",
            dark: "#00867d",
            contrastText: "#b0bec5"
        }
        
    }
});
ReactDOM.render((
    <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
            <App context={serverState} session={sessionState} />
        </MuiThemeProvider>
    </React.Fragment>
), document.getElementById("base-container"));