import noJquery from './rules/no-jquery';
import noAllowedPackages from './rules/no-allowed-packages';
import recommended from './configs/recommended';
import strict from './configs/strict';

const plugin = {
  rules: {
    'no-jquery': noJquery,
    'no-allowed-packages': noAllowedPackages
  },
  configs: {
    recommended,
    strict
  }
};

module.exports = plugin;
