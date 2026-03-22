declare module '@dezkareid/eslint-config-ts-base' {
  import type { Linter } from 'eslint';
  const config: Linter.Config[];
  export default config;
}

declare module '@stylistic/eslint-plugin' {
  import type { Linter } from 'eslint';
  const plugin: {
    configs: {
      customize: (options: {
        semi?: boolean;
        quotes?: 'single' | 'double';
        indent?: number | 'tab';
        jsx?: boolean;
      }) => Linter.Config;
    };
  };
  export default plugin;
}
