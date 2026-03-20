import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'danger', 'warning'],
    },
  },
  args: {
    children: 'Tag',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Variants ---

export const Default: Story = {
  args: { variant: 'default' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Success' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Warning' },
};

// --- Accessibility ---

export const WithAriaLabel: Story = {
  name: 'With aria-label (semantic variant)',
  args: {
    variant: 'danger',
    children: 'Rejected',
    'aria-label': 'Error: item rejected',
  },
};

// --- Compositions ---

export const AllVariants: Story = {
  name: 'All Variants',
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="default">Default</Tag>
      <Tag {...args} variant="success">Success</Tag>
      <Tag {...args} variant="danger">Danger</Tag>
      <Tag {...args} variant="warning">Warning</Tag>
    </div>
  ),
};

export const RichContent: Story = {
  name: 'Rich Content (non-text children)',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag variant="success">
        <span style={{ marginRight: '0.25rem' }}>✓</span> Active
      </Tag>
      <Tag variant="danger">
        <span style={{ marginRight: '0.25rem' }}>✕</span> Removed
      </Tag>
      <Tag variant="warning">
        <span style={{ marginRight: '0.25rem' }}>!</span> Pending
      </Tag>
    </div>
  ),
};

export const CustomColour: Story = {
  name: 'Custom Colour (CSS Custom Properties)',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag
        variant="default"
        style={{
          '--tag-default-color-background': 'var(--color-primary)',
          '--tag-default-color-text': 'var(--color-text-inverse)',
        } as React.CSSProperties}
      >
        Brand
      </Tag>
      <Tag
        variant="success"
        style={{
          '--tag-success-color-background': 'var(--color-warning)',
          '--tag-success-color-text': 'var(--color-text-primary)',
        } as React.CSSProperties}
      >
        Overridden
      </Tag>
    </div>
  ),
};
