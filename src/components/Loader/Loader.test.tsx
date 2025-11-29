import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Loader } from './Loader';

describe('Loader', () => {
  it('should render the loader', () => {
    render(
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    );
    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });

  it('should render spinner element', () => {
    const { container } = render(
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    );
    const spinner = container.querySelector('div > div');
    expect(spinner).toBeDefined();
  });

  it('should display uppercase loading text', () => {
    render(
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    );
    const loadingText = screen.getByText(/LOADING.../i);
    expect(loadingText).toBeDefined();
  });
});
