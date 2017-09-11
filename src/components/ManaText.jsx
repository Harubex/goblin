import React from "react";
import uuid from "uuid/v4";
import PropTypes from "prop-types";
import ManaCost from "./ManaCost";

export default class ManaText extends React.Component {
    render() {
        return (
            <span className="ms-font-su ms-fontColor-themePrimary">{this.parseContent(this.props.content)}</span>
        );
    }

    parseContent(content) {
        if (content && typeof(content) === "string") {
            let chunks = [];
            let last = 0;
            let chunkLengths = 0;
            for (let match = null, reg = /({[A-Z\/0-9]+})/gi; match = reg.exec(content); last = match.index + match[0].length) {
                chunks.push(content.slice(last, match.index), <ManaCost key={uuid()} sym={content.substr(match.index, match[0].length)} />);
            }
            chunks.push(content.substr(last));
            return chunks.filter((ele) => ele !== "").reduce((prev, curr) => {
                if (typeof(curr) === "string") {
                    curr.split("\n").forEach((ele, i, arr) => {
                        let addEles = [<p className="inline-text" key={uuid()}>{ele}</p>];
                        if (i < arr.length - 1) {
                            addEles.push(<p className="break-text"></p>);
                        }
                        prev.push(addEles);
                    });
                } else {
                    prev.push(curr);
                }
                return prev;
            }, []);
        }
    }

    addItalics(content) {
        let newContent = [];
        for (let i = 0; i < content.length; i++) {
            if (typeof (content[i]) === "string") {
                let leftChunks = content[i].split("(");
                let rightChunks = content[i].split(")");
                console.log(leftChunks);
                console.log(rightChunks);
                for (let j = 0; j < leftChunks.length; j++) {

                    if (j > 0) {
                        newContent.push(<i>{"(" + leftChunks[j]}</i>);
                    } else {
                        newContent.push(leftChunks[j]);
                    }
                }
                for (let j = 0; j < rightChunks.length; j++) {
                    if (j > 0) {
                        newContent.push(<i>{rightChunks[j] + ")"}</i>);
                    }
                }
            } else {
                newContent.push(content[i]);
            }
        }
        return newContent;
        /*content.match(/(\(.*?\))/g).forEach((val) => {
            content = content.replace(val, "<i>" + val + "</i>");
        });
        return content;*/
    }
}