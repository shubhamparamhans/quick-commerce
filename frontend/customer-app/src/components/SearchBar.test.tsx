import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders the input field', () => {
    act(() => {
      render(<SearchBar />);
    });
    expect(screen.getByPlaceholderText('Search for products...')).toBeInTheDocument();
  });

  it('displays suggestions based on user input', () => {
    act(() => {
      render(<SearchBar />);
    });
    const input = screen.getByPlaceholderText('Search for products...');

    fireEvent.change(input, { target: { value: 'Product' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
  });

  it('hides suggestions when input is cleared', () => {
    act(() => {
      render(<SearchBar />);
    });
    const input = screen.getByPlaceholderText('Search for products...');

    fireEvent.change(input, { target: { value: 'Product' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});