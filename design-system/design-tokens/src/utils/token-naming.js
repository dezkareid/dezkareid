const isThemed = (token) => token.path.includes('semantic') && (token.path.includes('light') || token.path.includes('dark'));
const isLight = (token) => token.path.includes('semantic') && token.path.includes('light');
const isDark = (token) => token.path.includes('semantic') && token.path.includes('dark');

const getCssName = (token) => {
  let parts = token.path;
  if (isLight(token)) {
    parts = token.path.filter(p => p !== 'light' && p !== 'semantic');
    return `light-${parts.join('-').replace(/-?val-?/gi, '-')}`;
  }
  if (isDark(token)) {
    parts = token.path.filter(p => p !== 'dark' && p !== 'semantic');
    return `dark-${parts.join('-').replace(/-?val-?/gi, '-')}`;
  }
  return parts.join('-').replace(/-?val-?/gi, '-');
};

const getScssName = (token) => {
  return token.path.join('-').replace(/-?val-?/gi, '-');
};

const getJsName = (token) => {
  let parts = token.path;

  if (isThemed(token)) {
    const theme = isLight(token) ? 'light' : 'dark';
    parts = [theme, ...token.path.filter(p =>
      p.toLowerCase() !== 'light' &&
      p.toLowerCase() !== 'dark' &&
      p.toLowerCase() !== 'semantic'
    )];
  }

  // Convert each part to PascalCase and join, then strip accidental Val in the middle
  const name = parts
    .map(p => p.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(''))
    .join('')
    .replace(/Val([0-9])/g, '$1');

  // Only add 'Val' prefix if the ENTIRE name starts with a digit
  return /^\d/.test(name) ? `Val${name}` : name;
};

module.exports = {
  isThemed,
  isLight,
  isDark,
  getCssName,
  getScssName,
  getJsName
};
