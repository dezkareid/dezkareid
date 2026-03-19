import { definePreview } from '@storybook/react-vite'
import addonPerformancePanel from '@github-ui/storybook-addon-performance-panel'
import '@dezkareid/design-tokens/dist/css/variables.css'
import '@dezkareid/components/css'

export default definePreview({
  addons: [addonPerformancePanel()],
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
});