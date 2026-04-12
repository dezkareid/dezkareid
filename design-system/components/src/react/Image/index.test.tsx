import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Image } from './index';

describe('Image', () => {
  it('renders standard img for non-cloudinary URLs', () => {
    const source = 'https://example.com/image.jpg';
    render(<Image src={source} alt="Test" />);
    const img = screen.getByRole('img', { name: 'Test' });
    expect(img).toHaveAttribute('src', source);
    expect(img).not.toHaveAttribute('srcset');
  });

  it('renders srcset for cloudinary URLs in responsive mode', () => {
    const source = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    render(<Image src={source} alt="Test" mode="responsive" />);
    const img = screen.getByRole('img', { name: 'Test' });
    expect(img).toHaveAttribute('srcset');
    expect(img.getAttribute('srcset')).toContain('w_420');
  });

  it('renders fixed width for cloudinary URLs in fixed mode', () => {
    const source = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    render(<Image src={source} alt="Test" mode="fixed" width={100} />);
    const img = screen.getByRole('img', { name: 'Test' });
    expect(img).toHaveAttribute('src');
    expect(img.getAttribute('src')).toContain('w_200'); // 2x DPR
    expect(img).not.toHaveAttribute('srcset');
  });

  it('respects strategy="cloudinary" even for unknown domains', () => {
    const source = 'https://custom-domain.com/upload/sample.jpg';
    render(<Image src={source} alt="Test" strategy="cloudinary" />);
    const img = screen.getByRole('img', { name: 'Test' });
    // Note: our simple strategy assumes /upload/ is present for transformation
    expect(img.getAttribute('src')).toContain('w_420');
  });
});
