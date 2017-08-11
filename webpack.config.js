const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve( __dirname, './' ),
  entry: {
    app: './js/source/app.js'
  },
  output: {
    path: path.resolve( __dirname, './js/build' ),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "./"),
    compress: false,
    port: 8080,
    historyApiFallback: true
  }
};
