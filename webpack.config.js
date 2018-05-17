const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const path = require("path");
const dest = "./build";

module.exports = {
    entry: "./src/main.jsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, dest),
    },
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        contentBase: dest,
        hot: true,
        port: 8000
    },
    module: {
        rules: [{
            test:  /\.(js|jsx)$/,
            exclude: "/node_modules/",
            loader: "babel-loader"
        }]
    },
    target: "web",
    plugins: [
        new CleanWebpackPlugin([dest]),
        new webpack.HotModuleReplacementPlugin()
    ]
}