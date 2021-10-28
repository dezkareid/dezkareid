const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const config = {
  devServer: {
    static: {
      directory: path.resolve('dist/browser')
    },
    port: 5001
  },
  mode: 'development'
};

module.exports = merge(commonConfig, config);
