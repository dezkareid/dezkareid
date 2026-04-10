import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Variants ---

export const Primary: Story = {
  args: { variant: 'primary', size: 'md' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md' },
};

export const Outline: Story = {
  args: { variant: 'outline', size: 'md' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md' },
};

export const Success: Story = {
  args: { variant: 'success', size: 'md' },
};

// --- Sizes ---

export const Small: Story = {
  args: { variant: 'primary', size: 'sm' },
};

export const Medium: Story = {
  args: { variant: 'primary', size: 'md' },
};

export const Large: Story = {
  args: { variant: 'primary', size: 'lg' },
};

// --- States ---

export const Disabled: Story = {
  args: { variant: 'primary', size: 'md', disabled: true },
};

export const DisabledSecondary: Story = {
  name: 'Disabled (Secondary)',
  args: { variant: 'secondary', size: 'md', disabled: true },
};

// --- Compositions ---

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="success">Success</Button>
    </div>
  ),
  args: { size: 'md' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
  args: { variant: 'primary' },
};

export const AllDisabled: Story = {
  name: 'All Variants Disabled',
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} variant="primary" disabled>Primary</Button>
      <Button {...args} variant="secondary" disabled>Secondary</Button>
      <Button {...args} variant="outline" disabled>Outline</Button>
      <Button {...args} variant="ghost" disabled>Ghost</Button>
      <Button {...args} variant="success" disabled>Success</Button>
    </div>
  ),
  args: { size: 'md' },
};

export const CustomColour: Story = {
  name: 'Custom Colour (CSS Custom Properties)',
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button
        {...args}
        variant="primary"
        style={{
          '--button-primary-color-background': 'var(--color-danger)',
          '--button-primary-color-text': 'var(--color-text-inverse)',
        } as React.CSSProperties}
      >
        Danger Primary
      </Button>
      <Button
        {...args}
        variant="success"
        style={{
          '--button-success-color-background': 'var(--color-warning)',
          '--button-success-color-text': 'var(--color-text-primary)',
        } as React.CSSProperties}
      >
        Warning Success
      </Button>
    </div>
  ),
  args: { size: 'md' },
};
