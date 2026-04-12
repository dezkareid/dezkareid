import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionToggle } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/ActionToggle',
  component: ActionToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: '🔔',
    'aria-label': 'Toggle notifications',
  },
} satisfies Meta<typeof ActionToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
