const StyleDictionary = require('style-dictionary').default;
const { getCssName, getScssName, getJsName, isLight, isDark, isThemed } = require('./token-naming');

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
  const globalCategories = {};
  const semanticTokens = [];
  const semanticMap = new Map();

  allTokens.forEach(token => {
    if (isThemed(token)) {
      semanticTokens.push(token);
      // Group by core path to identify pairs
      const corePath = token.path.filter(p => p !== 'light' && p !== 'dark' && p !== 'semantic').join('.');
      if (!semanticMap.has(corePath)) {
        semanticMap.set(corePath, { light: null, dark: null });
      }
      if (isLight(token)) semanticMap.get(corePath).light = token;
      if (isDark(token)) semanticMap.get(corePath).dark = token;
    } else {
      const cat = token.path[0];
      if (!globalCategories[cat]) globalCategories[cat] = [];
      globalCategories[cat].push(token);
    }
  });

  const formatLabel = format === 'all' ? 'AI-Optimized' : format.toUpperCase();
  let markdown = `# Design Tokens Catalog (${formatLabel})\n\n`;
  markdown += `This catalog contains design tokens optimized for ${format === 'all' ? 'AI and developer reference' : format.toUpperCase() + ' usage'}.\n\n`;

  // 1. Global Tokens Sections
  Object.keys(globalCategories).sort().forEach(catName => {
    markdown += `## ${catName.charAt(0).toUpperCase() + catName.slice(1)}\n\n`;
    markdown += generateTable(globalCategories[catName], format);
    markdown += '\n';
  });

  // 2. Semantic Tokens Section
  if (semanticMap.size > 0) {
    markdown += `## Semantic Tokens\n\n`;
    markdown += `The following semantic tokens are themed and support light/dark modes.\n\n`;

    const tableHeaders = getTableHeaders(format);
    markdown += `| ${tableHeaders.join(' | ')} |\n`;
    markdown += `| ${tableHeaders.map(() => ':---').join(' | ')} |\n`;

    // Sort semantic keys for stability
    const sortedCorePaths = Array.from(semanticMap.keys()).sort();

    sortedCorePaths.forEach(corePath => {
      const pair = semanticMap.get(corePath);
      
      // Add Synthesized Core Token (CSS only for light-dark support)
      if (format === 'all' || format === 'css') {
        if (pair.light && pair.dark) {
          const coreName = corePath.split('.').join('-');
          const lightName = getCssName(pair.light);
          const darkName = getCssName(pair.dark);
          
          let row = [];
          if (format === 'all' || format === 'css') row.push(`\`--${coreName}\``);
          if (format === 'all' || format === 'scss') row.push(`-`);
          if (format === 'all' || format === 'js') row.push(`-`);
          row.push(`\`light-dark(var(--${lightName}), var(--${darkName}))\``);
          markdown += `| ${row.join(' | ')} |\n`;
        }
      }

      // Add Individual Variants
      if (pair.light) markdown += `| ${generateRow(pair.light, format).join(' | ')} |\n`;
      if (pair.dark) markdown += `| ${generateRow(pair.dark, format).join(' | ')} |\n`;
    });
    markdown += '\n';
  }

  return markdown;
};

const getTableHeaders = (format) => {
  let headers = [];
  if (format === 'all' || format === 'css') headers.push('CSS Variable');
  if (format === 'all' || format === 'scss') headers.push('SCSS Variable');
  if (format === 'all' || format === 'js') headers.push('JS Variable');
  headers.push('Value');
  return headers;
};

const generateRow = (token, format) => {
  let row = [];
  if (format === 'all' || format === 'css') row.push(`\`--${getCssName(token)}\``);
  if (format === 'all' || format === 'scss') row.push(`\`$${getScssName(token)}\``);
  if (format === 'all' || format === 'js') row.push(`\`${getJsName(token)}\``);
  
  const value = typeof token.value === 'object' ? JSON.stringify(token.value) : token.value;
  row.push(`\`${value}\``);
  return row;
};

const generateTable = (tokens, format) => {
  const headers = getTableHeaders(format);
  let table = `| ${headers.join(' | ')} |\n`;
  table += `| ${headers.map(() => ':---').join(' | ')} |\n`;

  tokens.forEach(token => {
    table += `| ${generateRow(token, format).join(' | ')} |\n`;
  });
  return table;
};

module.exports = {
  initDictionary,
  generateCatalog
};
