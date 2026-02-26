const { isThemed, isLight, isDark, getCssName, getScssName, getJsName } = require('./src/utils/token-naming');
const { generateCatalog } = require('./src/utils/catalog-generator');

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
                return `var(--${getCssName(refToken)})`;
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
          lines.push(`  --${getCssName(token)}: ${formatValue(token)};`);
        });

        lightTokens.forEach(lightToken => {
          const corePath = lightToken.path.filter(p => p !== 'light' && p !== 'semantic');
          const coreName = corePath.join('-');

          const lightName = getCssName(lightToken);
          const lookupKey = lightToken.path.filter(p => p !== 'light').join('.');
          const darkToken = darkTokensMap.get(lookupKey);

          lines.push(`  --${lightName}: ${formatValue(lightToken)};`);

          if (darkToken) {
            const darkName = getCssName(darkToken);
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
                value = `$${getScssName(refToken)}`;
              }
            }
          }
          return `$${getScssName(token)}: ${value};`;
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
          const name = getJsName(token);
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
          const name = getJsName(token);
          lines.push(`export const ${name}: string;`);
        });

        return lines.join('\n');
      },
      'markdown/catalog': ({ dictionary, file }) => {
        return generateCatalog(dictionary.allTokens, file.options?.format);
      }
    }
  },
  platforms: {
    catalog: {
      transforms: ['color/css'],
      buildPath: 'dist/catalogs/',
      files: [
        {
          destination: 'all-tokens-css.md',
          format: 'markdown/catalog',
          options: { format: 'css' }
        },
        {
          destination: 'all-tokens-scss.md',
          format: 'markdown/catalog',
          options: { format: 'scss' }
        },
        {
          destination: 'all-tokens-js.md',
          format: 'markdown/catalog',
          options: { format: 'js' }
        }
      ]
    },
    css: {
      transforms: ['color/css'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-light-dark'
        },
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