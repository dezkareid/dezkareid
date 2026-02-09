import noJquery from './rules/no-jquery';
import noAllowedPackages from './rules/no-allowed-packages';
import noDeprecatedHtml from './rules/no-deprecated-html';
import requireImgAlt from './rules/require-img-alt';
import noInlineEventHandlers from './rules/no-inline-event-handlers';
import recommended from './configs/recommended';
import strict from './configs/strict';

const plugin = {
  rules: {
    'no-jquery': noJquery,
    'no-allowed-packages': noAllowedPackages,
    'no-deprecated-html': noDeprecatedHtml,
    'require-img-alt': requireImgAlt,
    'no-inline-event-handlers': noInlineEventHandlers
  },
  configs: {
    recommended,
    strict
  }
};

module.exports = plugin;