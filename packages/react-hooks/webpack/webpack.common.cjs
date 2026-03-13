const path = require('node:path');
const webpack = require('webpack');
const package_ = require('../package.json');

const { ModuleFederationPlugin } = webpack.container;

const name = package_.name.replace(/[^a-zA-Z0-9]/g, '_');

const exposes = {
  './useEventListener': './src/useEventListener',
  './useGoogleMaps': './src/useGoogleMaps',
  './useLocalStorage': './src/useLocalStorage',
};

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve('dist/browser'),
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: 'remote-entry.js',
      exposes,
      shared: { react: { singleton: true } },
    }),
  ],
};

module.exports = config;
