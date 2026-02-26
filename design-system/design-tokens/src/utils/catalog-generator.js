const StyleDictionary = require('style-dictionary').default;
const { getCssName, getScssName, getJsName } = require('./token-naming');

const initDictionary = async (platform) => {
  const sd = new StyleDictionary('sd.config.js');
  return await sd.exportPlatform(platform);
};

/**
 * Generates an AI-optimized Markdown catalog for design tokens.
 * Groups tokens by category and includes platform-specific variable names.
 * 
 * @param {Array} allTokens - Array of flattened tokens from Style Dictionary
 * @param {string} format - The format to target ('css', 'scss', 'js', or 'all')
 * @returns {string} Markdown content
 */
const generateCatalog = (allTokens, format = 'all') => {
  const categories = {};
  allTokens.forEach(token => {
    const cat = token.path[0];
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(token);
  });

  const formatLabel = format === 'all' ? 'AI-Optimized' : format.toUpperCase();
  let markdown = `# Design Tokens Catalog (${formatLabel})\n\n`;
  markdown += `This catalog contains design tokens optimized for ${format === 'all' ? 'AI and developer reference' : format.toUpperCase() + ' usage'}.\n\n`;

  Object.keys(categories).sort().forEach(catName => {
    markdown += `## ${catName.charAt(0).toUpperCase() + catName.slice(1)}\n\n`;
    
    // Determine table headers based on format
    let headers = [];
    if (format === 'all' || format === 'css') headers.push('CSS Variable');
    if (format === 'all' || format === 'scss') headers.push('SCSS Variable');
    if (format === 'all' || format === 'js') headers.push('JS Variable');
    headers.push('Value');

    markdown += `| ${headers.join(' | ')} |\n`;
    markdown += `| ${headers.map(() => ':---').join(' | ')} |\n`;

    categories[catName].forEach(token => {
      let row = [];
      if (format === 'all' || format === 'css') row.push(`\`--${getCssName(token)}\``);
      if (format === 'all' || format === 'scss') row.push(`\`$${getScssName(token)}\``);
      if (format === 'all' || format === 'js') row.push(`\`${getJsName(token)}\``);
      
      const value = typeof token.value === 'object' ? JSON.stringify(token.value) : token.value;
      row.push(`\`${value}\``);

      markdown += `| ${row.join(' | ')} |\n`;
    });
    markdown += '\n';
  });

  return markdown;
};

module.exports = {
  initDictionary,
  generateCatalog
};
