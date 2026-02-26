const isThemed = (token) => token.path.includes('semantic') && (token.path.includes('light') || token.path.includes('dark'));
const isLight = (token) => token.path.includes('semantic') && token.path.includes('light');
const isDark = (token) => token.path.includes('semantic') && token.path.includes('dark');

const getCssName = (token) => {
  if (isLight(token)) {
    const corePath = token.path.filter(p => p !== 'light' && p !== 'semantic');
    return `light-${corePath.join('-')}`;
  }
  if (isDark(token)) {
    const corePath = token.path.filter(p => p !== 'dark' && p !== 'semantic');
    return `dark-${corePath.join('-')}`;
  }
  return token.path.join('-');
};

const getScssName = (token) => {
  return token.path.join('-');
};

const getJsName = (token) => {
  const parts = token.path.map(part => /^\d/.test(part) ? `val${part}` : part);

  let finalParts = parts;
  if (isThemed(token)) {
    const theme = isLight(token) ? 'light' : 'dark';
    const filteredParts = parts.filter(p =>
      p.toLowerCase() !== 'light' &&
      p.toLowerCase() !== 'dark' &&
      p.toLowerCase() !== 'semantic' &&
      p.toLowerCase() !== 'vallight' &&
      p.toLowerCase() !== 'valdark'
    );
    finalParts = [theme, ...filteredParts];
  }

  return finalParts.map(p => p.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')).join('');
};

module.exports = {
  isThemed,
  isLight,
  isDark,
  getCssName,
  getScssName,
  getJsName
};
