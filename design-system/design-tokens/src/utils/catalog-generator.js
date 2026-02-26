const StyleDictionary = require('style-dictionary').default;
const { getCssName, getScssName, getJsName, isLight, isDark } = require('./token-naming');

const initDictionary = async (platform) => {
  const sd = new StyleDictionary('sd.config.js');
  return await sd.exportPlatform(platform);
};

const getFormatNamingFn = (format) => {
  switch (format.toLowerCase()) {
    case 'css': return getCssName;
    case 'scss': return getScssName;
    case 'js': return getJsName;
    default: return (token) => token.path.join('-');
  }
};

const flattenTokens = (obj) => {
  let tokens = [];
  for (let key in obj) {
    if (obj[key].hasOwnProperty('value')) {
      tokens.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      tokens = tokens.concat(flattenTokens(obj[key]));
    }
  }
  return tokens;
};

const generateMarkdownTable = (dictionary, format) => {
  const namingFn = getFormatNamingFn(format);
  const allTokens = flattenTokens(dictionary);
  const colorTokens = allTokens.filter(token => token.path.includes('color'));

  if (colorTokens.length === 0) {
    return 'No color tokens found.';
  }

  const formatLabel = format.toUpperCase();
  let markdown = `| Token Path | ${formatLabel} Name | Value |
`;
  markdown += `| :--- | :--- | :--- |
`;

  colorTokens.forEach(token => {
    const path = token.path.join('.');
    const name = namingFn(token);
    const value = token.value;

    markdown += `| ${path} | \`${name}\` | \`${value}\` |\n`;
  });

  return markdown;
};

module.exports = {
  initDictionary,
  generateMarkdownTable
};
