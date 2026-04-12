import type { Meta, StoryObj } from '@storybook/react-vite';
import { VerifiedBadge } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/VerifiedBadge',
  component: VerifiedBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 14,
  },
} satisfies Meta<typeof VerifiedBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 24 },
};
