import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Modal } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
  args: {
    open: true,
    onClose: fn(),
    title: 'Example Modal',
    children: (
      <div>
        <p>This is a modal content. It handles focus trapping and backdrop clicking.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={fn()}>Action</button>
        </div>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    children: (
      <div style={{ height: '120vh' }}>
        <p>Scrollable content...</p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>Paragraph {i + 1}</p>
        ))}
      </div>
    ),
  },
};
