import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@contexts/ThemeContext';
import { vi } from 'vitest';
import { Timer } from './Timer';

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render initial time as 00:00', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('should update elapsed time after 5 seconds', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('should format minutes and seconds correctly after 125 seconds', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(125000);
    });

    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('should pad single digit seconds with zero', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(65000);
    });

    expect(screen.getByText('01:05')).toBeInTheDocument();
  });

  it('should stop updating when isComplete is true', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const { rerender } = renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('00:05')).toBeInTheDocument();

    // Complete the timer
    rerender(
      <ThemeProvider>
        <Timer
          startTime={now}
          isComplete={true}
        />
      </ThemeProvider>,
    );

    // Advance time further - should not update
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('should have timer icon', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const { container } = renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should reset elapsed when startTime changes', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const { rerender } = renderWithTheme(
      <Timer
        startTime={now}
        isComplete={false}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText('00:10')).toBeInTheDocument();

    // Change startTime to simulate new game
    const newStart = Date.now();
    vi.setSystemTime(newStart);
    rerender(
      <ThemeProvider>
        <Timer
          startTime={newStart}
          isComplete={false}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
