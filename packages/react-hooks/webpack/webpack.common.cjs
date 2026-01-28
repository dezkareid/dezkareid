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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
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
