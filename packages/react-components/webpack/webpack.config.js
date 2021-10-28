const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const config = {
  mode: 'production'
};

module.exports = merge(commonConfig, config);
