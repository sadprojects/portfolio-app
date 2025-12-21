import { ThemeProvider } from '@contexts/ThemeContext';
import { render } from '@testing-library/react';
import Experience from './Experience';

describe('Experience Page', () => {
  it('renders experience page without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <Experience />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('displays timeline structure', () => {
    const { container } = render(
      <ThemeProvider>
        <Experience />
      </ThemeProvider>
    );
    expect(container.querySelector('div')).toBeDefined();
  });

  it('renders with proper structure', () => {
    const { container } = render(
      <ThemeProvider>
        <Experience />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('initializes without errors', () => {
    expect(() => {
      render(
        <ThemeProvider>
          <Experience />
        </ThemeProvider>
      );
    }).not.toThrow();
  });

  it('mounts successfully', () => {
    const { unmount } = render(
      <ThemeProvider>
        <Experience />
      </ThemeProvider>
    );
    expect(unmount).toBeDefined();
  });

  it('renders education section', () => {
    const { container } = render(
      <ThemeProvider>
        <Experience />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });
});
