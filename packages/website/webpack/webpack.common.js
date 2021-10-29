const path = require('path');
const { camelCase } = require('camel-case');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json');

const { ModuleFederationPlugin } = webpack.container;

const name = camelCase(pkg.name);

const exposes = {
  './DezkaApp': './src/App'
};

const remoteReactComponentsURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : 'https://unpkg.com/@dezkareid/react-components/dist/browser';

const remotes = {
  '@dezkareid/react-components': `dezkareidReactComponents@${remoteReactComponentsURL}/remote-entry.js`
};

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  },
  output: {
    path: path.resolve('dist')
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: 'remote-entry.js',
      exposes,
      remotes,
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};

module.exports = config;
