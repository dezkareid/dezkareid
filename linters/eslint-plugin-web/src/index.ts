import noJquery from './rules/no-jquery';
import noAllowedPackages from './rules/no-allowed-packages';

const plugin = {
  rules: {
    'no-jquery': noJquery,
    'no-allowed-packages': noAllowedPackages
  }
};

export default plugin;
