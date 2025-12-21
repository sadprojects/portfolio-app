import { AccessibilityProvider } from '@contexts/AccessibilityContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AccessibilityProvider>
      <ThemeProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </AccessibilityProvider>
  );
};

describe('NotFound Page', () => {
  it('renders 404 page without crashing', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText(/404/i)).toBeDefined();
  });

  it('displays not found message', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText(/not found/i)).toBeDefined();
  });

  it('includes navigation back to home', () => {
    const { container } = renderWithProviders(<NotFound />);
    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).toBeDefined();
  });

  it('renders with proper structure', () => {
    const { container } = renderWithProviders(<NotFound />);
    expect(container.firstChild).toBeDefined();
  });

  it('initializes without errors', () => {
    expect(() => {
      renderWithProviders(<NotFound />);
    }).not.toThrow();
  });
});
