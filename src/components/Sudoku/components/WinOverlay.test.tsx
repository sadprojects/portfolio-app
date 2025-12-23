import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@contexts/ThemeContext';
import { vi } from 'vitest';
import { WinOverlay } from './WinOverlay';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('WinOverlay', () => {
  const defaultProps = {
    isComplete: true,
    elapsedTime: 125,
    isNewBestTime: false,
    difficulty: 'medium' as const,
    onPlayAgain: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isComplete is false', () => {
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        isComplete={false}
      />,
    );
    expect(screen.queryByText(/Puzzle Complete!/i)).not.toBeInTheDocument();
  });

  it('should render puzzle complete message when isComplete is true', () => {
    renderWithTheme(<WinOverlay {...defaultProps} />);
    expect(screen.getByText(/Puzzle Complete!/i)).toBeInTheDocument();
  });

  it('should display formatted time', () => {
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        elapsedTime={125}
      />,
    );
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('should show new record badge when isNewBestTime is true', () => {
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        isNewBestTime={true}
      />,
    );
    expect(screen.getByText(/New Record!/i)).toBeInTheDocument();
  });

  it('should not show new record badge when isNewBestTime is false', () => {
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        isNewBestTime={false}
      />,
    );
    expect(screen.queryByText(/New Record!/i)).not.toBeInTheDocument();
  });

  it('should render trophy icon', () => {
    const { container } = renderWithTheme(<WinOverlay {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-trophy');
  });

  it('should call onPlayAgain with difficulty when Play Again button is clicked', async () => {
    const onPlayAgain = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        onPlayAgain={onPlayAgain}
      />,
    );

    const button = screen.getByRole('button', { name: /Play Again/i });
    await user.click(button);

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    expect(onPlayAgain).toHaveBeenCalledWith('medium');
  });

  it('should render Play Again button', () => {
    renderWithTheme(<WinOverlay {...defaultProps} />);
    const button = screen.getByRole('button', { name: /Play Again/i });
    expect(button).toBeInTheDocument();
  });

  it('should format time with leading zero for seconds', () => {
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        elapsedTime={65}
      />,
    );
    expect(screen.getByText('01:05')).toBeInTheDocument();
  });

  it('should handle zero time correctly', () => {
    renderWithTheme(
      <WinOverlay
        {...defaultProps}
        elapsedTime={0}
      />,
    );
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
