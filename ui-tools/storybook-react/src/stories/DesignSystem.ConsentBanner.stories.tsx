import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConsentBanner } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/ConsentBanner',
  component: ConsentBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onAccept: fn(),
    onDecline: fn(),
  },
} satisfies Meta<typeof ConsentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    // Clear localStorage to ensure banner shows up in storybook
    localStorage.removeItem('ga_consent');
    return <ConsentBanner {...args} />;
  },
};
