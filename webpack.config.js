const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require("path");
const dest = "./build";
const mode = "production";

module.exports = {
    entry: "./src/main.jsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    resolve: {
    extensions: [".js", ".jsx", ".json"]
    },
    mode,
    devtool: "eval-source-map",
    optimization: {
        minimize: true
    },
    devServer: {
        contentBase: dest,
        hot: true,
        port: 8001
    },
    module: {
        rules: [{
            test:  /\.jsx$/,
            exclude: "/node_modules/",
            use: {
                loader: "babel-loader"
            }
        }]
    },
    target: "web",
    plugins: [
        new webpack.DefinePlugin([{
            "process.env.NODE_ENV": mode
        }]),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new BundleAnalyzerPlugin()
    ]
}