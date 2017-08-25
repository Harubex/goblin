import React from "react";
import uuid from "uuid/v4";
import PropTypes from "prop-types";
import ManaCost from "./ManaCost";

export default class ManaText extends React.Component ***REMOVED***
    render() ***REMOVED***
        return (
            <span className="ms-font-su ms-fontColor-themePrimary">***REMOVED***this.parseContent(this.props.content)***REMOVED***</span>
        );
    ***REMOVED***

    parseContent(content) ***REMOVED***
        if (content && typeof(content) === "string") ***REMOVED***
            let chunks = [];
            let last = 0;
            let chunkLengths = 0;
            for (let match = null, reg = /(***REMOVED***[A-Z\/0-9]+***REMOVED***)/gi; match = reg.exec(content); last = match.index + match[0].length) ***REMOVED***
                chunks.push(content.slice(last, match.index), <ManaCost key=***REMOVED***uuid()***REMOVED*** sym=***REMOVED***content.substr(match.index, match[0].length)***REMOVED*** />);
            ***REMOVED***
            chunks.push(content.substr(last));
            return chunks.filter((ele) => ele !== "").reduce((prev, curr) => ***REMOVED***
                if (typeof(curr) === "string") ***REMOVED***
                    curr.split("\n").forEach((ele, i) => ***REMOVED***
                        prev.push(i > 0 ? <p key=***REMOVED***uuid()***REMOVED***>***REMOVED***ele***REMOVED***</p> : ele);
                    ***REMOVED***);
                ***REMOVED*** else ***REMOVED***
                    prev.push(curr);
                ***REMOVED***
                return prev;
            ***REMOVED***, []);
        ***REMOVED***
    ***REMOVED***

    addItalics(content) ***REMOVED***
        let newContent = [];
        for (let i = 0; i < content.length; i++) ***REMOVED***
            if (typeof (content[i]) === "string") ***REMOVED***
                let leftChunks = content[i].split("(");
                let rightChunks = content[i].split(")");
                console.log(leftChunks);
                console.log(rightChunks);
                for (let j = 0; j < leftChunks.length; j++) ***REMOVED***

                    if (j > 0) ***REMOVED***
                        newContent.push(<i>***REMOVED***"(" + leftChunks[j]***REMOVED***</i>);
                    ***REMOVED*** else ***REMOVED***
                        newContent.push(leftChunks[j]);
                    ***REMOVED***
                ***REMOVED***
                for (let j = 0; j < rightChunks.length; j++) ***REMOVED***
                    if (j > 0) ***REMOVED***
                        newContent.push(<i>***REMOVED***rightChunks[j] + ")"***REMOVED***</i>);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                newContent.push(content[i]);
            ***REMOVED***
        ***REMOVED***
        return newContent;
        /*content.match(/(\(.*?\))/g).forEach((val) => ***REMOVED***
            content = content.replace(val, "<i>" + val + "</i>");
        ***REMOVED***);
        return content;*/
    ***REMOVED***
***REMOVED***