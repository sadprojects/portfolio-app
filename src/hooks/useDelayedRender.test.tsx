import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen, waitFor } from '@testing-library/react';
import useDelayedRender from './useDelayedRender';

const TestComponent = () => <div>Test Content</div>;

const TestWrapper = ({ delay = 100 }: { delay?: number }) => {
  const rendered = useDelayedRender(<TestComponent />, delay);
  return (
    <ThemeProvider>
      <div>{rendered}</div>
    </ThemeProvider>
  );
};

describe('useDelayedRender', () => {
  it('should show loader initially', () => {
    render(<TestWrapper delay={500} />);
    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('should render component after delay', async () => {
    render(<TestWrapper delay={100} />);

    await waitFor(
      () => {
        expect(screen.getByText('Test Content')).toBeDefined();
      },
      { timeout: 200 }
    );
  });

  it('should use default delay of 300ms', async () => {
    const Wrapper = () => {
      const rendered = useDelayedRender(<TestComponent />);
      return (
        <ThemeProvider>
          <div>{rendered}</div>
        </ThemeProvider>
      );
    };

    render(<Wrapper />);
    expect(screen.getByText(/loading/i)).toBeDefined();

    await waitFor(
      () => {
        expect(screen.getByText('Test Content')).toBeDefined();
      },
      { timeout: 400 }
    );
  });

  it('should cleanup timeout on unmount', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(<TestWrapper delay={500} />);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    vi.useRealTimers();
    clearTimeoutSpy.mockRestore();
  });
});
