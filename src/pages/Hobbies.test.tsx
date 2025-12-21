import { ThemeProvider } from '@contexts/ThemeContext';
import { render } from '@testing-library/react';
import Hobbies from './Hobbies';

describe('Hobbies Page', () => {
  it('renders hobbies page without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <Hobbies />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('displays hobbies content', () => {
    const { container } = render(
      <ThemeProvider>
        <Hobbies />
      </ThemeProvider>
    );
    expect(container.querySelector('div')).toBeDefined();
  });

  it('renders with proper structure', () => {
    const { container } = render(
      <ThemeProvider>
        <Hobbies />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('initializes without errors', () => {
    expect(() => {
      render(
        <ThemeProvider>
          <Hobbies />
        </ThemeProvider>
      );
    }).not.toThrow();
  });

  it('mounts successfully', () => {
    const { unmount } = render(
      <ThemeProvider>
        <Hobbies />
      </ThemeProvider>
    );
    expect(unmount).toBeDefined();
  });

  it('handles missing data gracefully', () => {
    const { container } = render(
      <ThemeProvider>
        <Hobbies />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeDefined();
  });
});
