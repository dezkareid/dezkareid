import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from '@dezkareid/icons/react';

const iconNames = Object.keys(Icons) as (keyof typeof Icons)[];

interface IconCatalogProps {
  iconSize: string;
  color: string;
}

function IconCatalog({ iconSize, color }: IconCatalogProps) {
  return (
    <div style={{ color }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '24px',
          padding: '24px',
        }}
      >
        {iconNames.map((name) => {
          const IconComponent = Icons[name];
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <IconComponent
                style={{ '--icon-size': iconSize } as React.CSSProperties}
                label={name}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  textAlign: 'center',
                  wordBreak: 'break-all',
                }}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta<IconCatalogProps> = {
  title: 'Design System/Icons',
  component: IconCatalog,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    iconSize: {
      control: 'text',
      description: 'Value for the --icon-size CSS custom property',
    },
    color: {
      control: 'color',
      description: 'Icon color (inherited via currentColor)',
    },
  },
};

export default meta;
type Story = StoryObj<IconCatalogProps>;

export const Catalog: Story = {
  args: {
    iconSize: '24px',
    color: '#111827',
  },
};

export const Large: Story = {
  args: {
    iconSize: '48px',
    color: '#111827',
  },
};

export const Colored: Story = {
  args: {
    iconSize: '32px',
    color: '#6366f1',
  },
};
