/** @type {import('svgo').Config} */
export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox so icons scale correctly via CSS
          removeViewBox: false,
          // Do not convert currentColor to a literal — color must remain inheritable
          convertColors: false,
          // Remove width/height — size is controlled via --icon-size CSS custom property
          removeUselessDefs: true,
        },
      },
    },
    // Remove width and height attributes from the root <svg>
    {
      name: 'removeAttrs',
      params: {
        attrs: ['svg:width', 'svg:height'],
      },
    },
  ],
};
