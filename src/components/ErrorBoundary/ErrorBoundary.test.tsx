import { ThemeProvider } from '@contexts/ThemeContext';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const NoError = () => <div>No error</div>;

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    const { container } = render(
      <ThemeProvider>
        <ErrorBoundary>
          <NoError />
        </ErrorBoundary>
      </ThemeProvider>
    );
    expect(container.textContent).toContain('No error');
  });

  it('should catch errors and display error UI', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    const { container } = render(
      <ThemeProvider>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </ThemeProvider>
    );

    expect(container.textContent).toContain('Oops! Something went wrong');
    expect(container.textContent).toContain('Test error');

    console.error = originalError;
  });

  it('should display error details', () => {
    const originalError = console.error;
    console.error = () => {};

    const { container } = render(
      <ThemeProvider>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </ThemeProvider>
    );

    expect(container.textContent).toContain('Error Details:');
    expect(container.textContent).toContain('Test error');

    console.error = originalError;
  });

  it('should render refresh and report buttons', () => {
    const originalError = console.error;
    console.error = () => {};

    const { container } = render(
      <ThemeProvider>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </ThemeProvider>
    );

    expect(container.textContent).toContain('Refresh Page');
    expect(container.textContent).toContain('Copy Error');
    expect(container.textContent).toContain('Report Issue');

    console.error = originalError;
  });
});
