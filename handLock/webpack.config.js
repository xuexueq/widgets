const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const proxyPort = 8081;

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        // }, {
        //     test: /\.less$/,
        //     exclude: /node_modules/,
        //     use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
        // }, {
        //     test: /\.css$/,
        //     exclude: /node_modules/,
        //     use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader'])
        // }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html'
        }),
        new ExtractTextPlugin('common.css')
    ],
    devServer: {
        contentBase: './dist'
    }
};