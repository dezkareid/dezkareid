import * as githubUiStorybookAddonPerformancePanel from "@github-ui/storybook-addon-performance-panel/preview";
import addonA11y from "@storybook/addon-a11y";
import { definePreview } from '@storybook/react-vite'
import addonPerformancePanel from '@github-ui/storybook-addon-performance-panel'
import '@dezkareid/design-tokens/dist/css/variables.css'
import '@dezkareid/components/css'

export default definePreview({
  addons: [
    addonPerformancePanel(),
    addonA11y(),
    githubUiStorybookAddonPerformancePanel
  ],

  globals: {
    colorScheme: 'light',
  },

  globalTypes: {
    colorScheme: {
      description: 'Color scheme (light / dark)',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const scheme = (context.globals['colorScheme'] as string) ?? 'light';
      document.documentElement.style.colorScheme = scheme;
      document.documentElement.style.backgroundColor = 'var(--color-background-primary)';
      return Story();
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  initialGlobals: {
    colorScheme: 'light',
  }
});