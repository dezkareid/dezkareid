import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Collections', href: '/collections' },
      { label: 'Figures', href: '/collections/figures' },
      { label: 'Spider-man' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Short: Story = {
  args: {
    items: [
      { label: '@dezkareid', href: '/dezkareid' },
      { label: 'My Amazing Collection' },
    ],
  },
};
