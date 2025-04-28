import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const product = {
    id: 1,
    name: 'Test Product',
    price: 19.99,
    image: 'test_image_url',
  };

  it('renders product details correctly', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /test product/i })).toHaveAttribute('src', 'test_image_url');
  });

  it('handles Add to Cart button click', () => {
    const { getByText } = render(<ProductCard product={product} />);
    const button = getByText('Add to Cart');

    fireEvent.click(button);
    // Add assertions for button click behavior if needed
  });
});