import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LikeButton } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/LikeButton',
  component: LikeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    animating: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
    'aria-label': 'Like item',
  },
} satisfies Meta<typeof LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Liked: Story = {
  args: { active: true },
};

export const Animating: Story = {
  args: { active: true, animating: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
