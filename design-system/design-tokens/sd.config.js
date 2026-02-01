const isThemed = (token) => token.path.includes('semantic') && (token.path.includes('light') || token.path.includes('dark'));
const isLight = (token) => token.path.includes('semantic') && token.path.includes('light');
const isDark = (token) => token.path.includes('semantic') && token.path.includes('dark');

module.exports = {
  source: ['src/tokens/**/*.json'],
  hooks: {
    formats: {
      'css/variables-light-dark': ({ dictionary }) => {
        const tokenPathMap = new Map();
        dictionary.allTokens.forEach(t => tokenPathMap.set(t.path.join('.'), t));

        const formatValue = (token) => {
          if (typeof token.original.value === 'string') {
            const match = token.original.value.match(/^\{([^}]+)\}$/);
            if (match) {
              const refPath = match[1];
              const refToken = tokenPathMap.get(refPath);
              if (refToken) {
                return `var(--${refToken.path.join('-')})`;
              }
            }
          }
          return token.value;
        };

        const lightTokens = [];
        const darkTokensMap = new Map();
        const otherTokens = [];

        dictionary.allTokens.forEach(token => {
          if (isLight(token)) {
            lightTokens.push(token);
          } else if (isDark(token)) {
            const key = token.path.filter(p => p !== 'dark').join('.');
            darkTokensMap.set(key, token);
          } else {
            otherTokens.push(token);
          }
        });

        const lines = [
          `/**`,
          ` * Do not edit directly, this file was auto-generated.`, 
          ` */`, 
          ``,
          `:root {`,
          `  color-scheme: light dark;`
        ];

        otherTokens.forEach(token => {
          // Join path with hyphens for standard tokens
          const name = token.path.join('-');
          lines.push(`  --${name}: ${formatValue(token)};`);
        });

        lightTokens.forEach(lightToken => {
          // Construct core name (e.g., color-primary)
          const corePath = lightToken.path.filter(p => p !== 'light' && p !== 'semantic');
          const coreName = corePath.join('-'); 

          const lightName = `light-${coreName}`;
          const darkName = `dark-${coreName}`;

          const lookupKey = lightToken.path.filter(p => p !== 'light').join('.');
          const darkToken = darkTokensMap.get(lookupKey);

          lines.push(`  --${lightName}: ${formatValue(lightToken)};`);
          
          if (darkToken) {
            lines.push(`  --${darkName}: ${formatValue(darkToken)};`);
            lines.push(`  --${coreName}: light-dark(var(--${lightName}), var(--${darkName}));`);
          } else {
            lines.push(`  --${coreName}: var(--${lightName});`);
          }
        });

        lines.push(`}`);
        return lines.join('\n');
      },
      'scss/simple': ({ dictionary }) => {
        const tokenPathMap = new Map();
        dictionary.allTokens.forEach(t => tokenPathMap.set(t.path.join('.'), t));

        return dictionary.allTokens.map(token => {
          let value = token.value;
          if (typeof token.original.value === 'string') {
            const match = token.original.value.match(/^\{([^}]+)\}$/);
            if (match) {
              const refPath = match[1];
              const refToken = tokenPathMap.get(refPath);
              if (refToken) {
                value = `$${refToken.path.join('-')}`;
              }
            }
          }
          return `$${token.path.join('-')}: ${value};`;
        }).join('\n');
      },
      'js/custom-module': ({ dictionary }) => {
        const lines = [
          `/**`,
          ` * Do not edit directly, this file was auto-generated.`, 
          ` */`, 
          ``
        ];

        dictionary.allTokens.forEach(token => {
          // Generate a safe JS identifier
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

          const name = finalParts.map(p => p.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')).join('');
          lines.push(`export const ${name} = ${JSON.stringify(token.value)};`);
        });

        return lines.join('\n');
      },
      'typescript/custom-declarations': ({ dictionary }) => {
        const lines = [
          `/**`,
          ` * Do not edit directly, this file was auto-generated.`, 
          ` */`, 
          ``
        ];

        dictionary.allTokens.forEach(token => {
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

          const name = finalParts.map(p => p.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')).join('');
          lines.push(`export const ${name}: string;`);
        });

        return lines.join('\n');
      }
    }
  },
  platforms: {
    css: {
      transforms: ['color/css'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-light-dark'
        }
      ]
    },
    scss: {
      transforms: ['color/css'],
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/simple'
        }
      ]
    },
    js: {
      transforms: ['color/hex'],
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'js/custom-module'
        },
        {
          destination: 'tokens.mjs',
          format: 'js/custom-module'
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/custom-declarations'
        }
      ]
    }
  }
};