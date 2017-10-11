import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { withStyles } from "material-ui/styles";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import SetCard from "./components/SetCard";
import Select from "material-ui/Select";
import Button from "material-ui/Button";

class ImportExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            importFile: "",
            message: this.props.context ? this.props.context.message : false,
            importCollection: ""
        };
        // Seperate error text from dialog open state to avoid user seeing text disappear before the dialog does.
        this.state.dialogOpen = !!this.state.message;
    }

    fileChosen(ctx, ev) {
        ctx.setState({
            importFile: ev.target.value
        });
    }

    collectionChosen(ctx, ev) {
        ctx.setState({
            importCollection: ev.target.value
        });
    }

    clearMessage(ctx) {
        ctx.setState({
            dialogOpen: false
        });
    }

    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Dialog title="Error" modal={false} open={this.state.dialogOpen} onRequestClose={() => this.clearMessage(this)}>
                    <DialogTitle>File Upload</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.clearMessage(this)} color="primary">
                            {"Okay"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <form method="post" action="" encType="multipart/form-data">
                    <TextField className={classes.textField} placeholder="Import a file." onChange={(ev) => this.fileChosen(this, ev)}
                        value={this.state.importFile} type="file" accept=".png" inputProps={{
                            name: "importFiles",
                            accept: ".csv"
                        }}/>
                    <Select native name="collection" value={this.state.importCollection} onChange={(ev) => this.collectionChosen(this, ev)}>
                        {this.props.context.collections.map((ele) => (
                            <option key={ele.id} value={ele.id} className={classes.setOption} onClick={() => this.setChosen(this, ele.id, ele.set_name)}>
                                {ele.name}
                            </option>
                        ))}
                    </Select>
           
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default withStyles({
    set_container: {
        textAlign: "center"
    }
})(ImportExport);