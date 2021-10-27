const path = require('path');
const { camelCase } = require('camel-case');
const webpack = require('webpack');
const pkg = require('../package.json');

const { ModuleFederationPlugin } = webpack.container;

const name = camelCase(pkg.name);

const exposes = {
  './useEventListener': './src/useEventListener',
  './useGoogleMaps': './src/useGoogleMaps',
  './useLocalStorage': './src/useLocalStorage'
};

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  output: {
    path: path.resolve('../dist/browser')
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
