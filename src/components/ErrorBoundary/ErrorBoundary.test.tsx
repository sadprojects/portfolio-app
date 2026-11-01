import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';

import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const renderWith = (child: React.ReactNode) =>
  render(
    <ThemeProvider>
      <ErrorBoundary>{child}</ErrorBoundary>
    </ThemeProvider>,
  );

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    renderWith(<div>No error</div>);
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('shows the message, the error and a refresh button when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWith(<ThrowError />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong.',
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Refresh page' }),
    ).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
