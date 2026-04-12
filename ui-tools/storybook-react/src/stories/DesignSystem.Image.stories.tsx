import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '@dezkareid/components/react';

const meta = {
  title: 'Design System/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['responsive', 'fixed'],
    },
    strategy: {
      control: 'select',
      options: ['default', 'cloudinary'],
    },
  },
  args: {
    src: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    alt: 'Sample image',
    mode: 'responsive',
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  args: {
    mode: 'responsive',
    aspectRatio: '16 / 9',
    style: { width: '600px' },
  },
};

export const Fixed: Story = {
  args: {
    mode: 'fixed',
    width: 200,
    height: 200,
    aspectRatio: '1 / 1',
  },
};

export const NonCloudinary: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    mode: 'fixed',
    width: 300,
  },
};
