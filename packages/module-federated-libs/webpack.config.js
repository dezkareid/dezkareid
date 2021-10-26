const path = require('path');
const { camelCase } = require('camel-case');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;
const { merge } = require('webpack-merge');
const pkg = require('./package.json');
const name = camelCase(pkg.name);

const exposes = {
  './google-maps': './src/gm.js',
  './google-maps-loader': './src/gm-loader.js',
};

const asyncExternals = {
  'google-maps': `promise new Promise((resolve) => {
    const mapScript = document.createElement('script');
    mapScript.src = "https://maps.googleapis.com/maps/api/js?key=" + window.GOOGLE_MAPS_API_KEY;
    mapScript.async = true;
    document.body.appendChild(mapScript);
    mapScript.addEventListener('load', () => {
      resolve(window.google)
    });
  });`
}


const config = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },
  output: {
    path: path.resolve('./dist/browser'),
  },
  externalsType: 'script',
  externals: asyncExternals,
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: 'remote-entry.js',
      exposes
    }),
  ],
};


module.exports = config;
