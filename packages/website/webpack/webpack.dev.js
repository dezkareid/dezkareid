const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const GOOGLE_MAPS_KEY = require('./keys');

const { EnvironmentPlugin } = webpack;

const config = {
  devServer: {
    static: {
      directory: path.resolve('dist/browser')
    },
    port: 5002
  },
  mode: 'development',
  plugins: [
    new EnvironmentPlugin({
      GOOGLE_MAPS_KEY
    })
  ]
};

module.exports = merge(commonConfig, config);
