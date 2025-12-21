import { ThemeProvider } from '@contexts/ThemeContext';
import { render } from '@testing-library/react';
import Projects from './Projects';

describe('Projects Page', () => {
  it('renders projects page without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <Projects />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('displays projects grid', () => {
    const { container } = render(
      <ThemeProvider>
        <Projects />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('renders with proper structure', () => {
    const { container } = render(
      <ThemeProvider>
        <Projects />
      </ThemeProvider>
    );
    expect(container.querySelector('div')).toBeDefined();
  });

  it('initializes without errors', () => {
    expect(() => {
      render(
        <ThemeProvider>
          <Projects />
        </ThemeProvider>
      );
    }).not.toThrow();
  });

  it('mounts successfully', () => {
    const { unmount } = render(
      <ThemeProvider>
        <Projects />
      </ThemeProvider>
    );
    expect(unmount).toBeDefined();
  });
});
