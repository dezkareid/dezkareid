// CSS Modules
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

// Astro components
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const Component: AstroComponentFactory;
  export default Component;
}

// Vue SFCs
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const Component: DefineComponent;
  export default Component;
}
