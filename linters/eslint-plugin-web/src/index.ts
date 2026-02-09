import noJquery from './rules/no-jquery';
import noAllowedPackages from './rules/no-allowed-packages';
import noDeprecatedHtml from './rules/no-deprecated-html';
import requireImgAlt from './rules/require-img-alt';
import noInlineEventHandlers from './rules/no-inline-event-handlers';

const plugin = {
  rules: {
    'no-jquery': noJquery,
    'no-allowed-packages': noAllowedPackages,
    'no-deprecated-html': noDeprecatedHtml,
    'require-img-alt': requireImgAlt,
    'no-inline-event-handlers': noInlineEventHandlers
  }
};

module.exports = plugin;
