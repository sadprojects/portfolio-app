import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@contexts/ThemeContext';
import { Toast } from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render toast message when visible', () => {
    render(
      <ThemeProvider>
        <Toast
          message="Test message"
          isVisible={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(
      <ThemeProvider>
        <Toast
          message="Test message"
          isVisible={false}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should call onClose after duration', () => {
    const onClose = vi.fn();

    render(
      <ThemeProvider>
        <Toast
          message="Test message"
          isVisible={true}
          onClose={onClose}
          duration={2500}
        />
      </ThemeProvider>,
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have proper aria attributes for accessibility', () => {
    render(
      <ThemeProvider>
        <Toast
          message="Test message"
          isVisible={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    const toastElement = screen.getByRole('status');
    expect(toastElement).toHaveAttribute('aria-live', 'polite');
    expect(toastElement).toHaveAttribute('aria-atomic', 'true');
  });

  it('should render custom icon when provided', () => {
    render(
      <ThemeProvider>
        <Toast
          message="Test message"
          isVisible={true}
          onClose={() => {}}
          icon={<span data-testid="custom-icon">🎉</span>}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
