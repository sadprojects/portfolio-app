import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';
import Contact from './Contact';

describe('Contact Page', () => {
  it('renders contact page without crashing', () => {
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    );
    expect(screen.getByText(/contact/i)).toBeDefined();
  });

  it('displays contact information cards', () => {
    const { container } = render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    );
    expect(container.querySelector('a[href^="mailto:"]')).toBeDefined();
  });

  it('includes LinkedIn link', () => {
    const { container } = render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    );
    const linkedInLink = container.querySelector('a[href*="linkedin.com"]');
    expect(linkedInLink).toBeDefined();
  });

  it('shows location information', () => {
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    );
    expect(screen.getByText(/Bucharest/i)).toBeDefined();
  });

  it('renders with proper structure', () => {
    const { container } = render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });
});

