const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const { EnvironmentPlugin } = webpack;
const config = {
  mode: 'production',
  plugins: [
    new EnvironmentPlugin({
      GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
    })
  ]
};

module.exports = merge(commonConfig, config);
