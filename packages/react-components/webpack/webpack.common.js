const path = require('path');
const { camelCase } = require('camel-case');
const webpack = require('webpack');
const pkg = require('../package.json');

const { ModuleFederationPlugin } = webpack.container;

const name = camelCase(pkg.name);

const exposes = {
  './GoogleMaps': './src/GoogleMaps'
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
    path: path.resolve('dist/browser')
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: 'remote-entry.js',
      exposes,
      shared: { react: { singleton: true } }
    })
  ]
};

module.exports = config;
