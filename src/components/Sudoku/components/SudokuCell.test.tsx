import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@contexts/ThemeContext';
import { SudokuCell } from './SudokuCell';

describe('SudokuCell', () => {
  const defaultProps = {
    value: 0,
    row: 0,
    col: 0,
    isSelected: false,
    isHighlighted: false,
    isInitial: false,
    isError: false,
    isSameNumber: false,
    isNumberSelected: false,
    onClick: vi.fn(),
  };

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty cell when value is 0', () => {
    renderWithTheme(<SudokuCell {...defaultProps} />);
    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('');
  });

  it('should render cell with value', () => {
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        value={5}
      />,
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('5');
  });

  it('should call onClick with row and col when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        row={3}
        col={4}
        onClick={onClick}
      />,
    );

    const cell = screen.getByRole('button');
    await user.click(cell);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(3, 4);
  });

  it('should have tabIndex 0 when selected', () => {
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        isSelected={true}
      />,
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveAttribute('tabIndex', '0');
  });

  it('should have tabIndex -1 when not selected', () => {
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        isSelected={false}
      />,
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveAttribute('tabIndex', '-1');
  });

  it('should have correct aria-label for empty cell', () => {
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        row={2}
        col={3}
      />,
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveAttribute('aria-label', 'Row 3, Column 4, empty');
  });

  it('should have correct aria-label for filled cell', () => {
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        row={5}
        col={6}
        value={7}
      />,
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveAttribute('aria-label', 'Row 6, Column 7, 7');
  });

  it('should have data-initial attribute when initial', () => {
    renderWithTheme(
      <SudokuCell
        {...defaultProps}
        isInitial={true}
      />,
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveAttribute('data-initial', 'true');
  });

  it('should be memoized', () => {
    const onClick = vi.fn();
    const { rerender } = renderWithTheme(
      <SudokuCell
        {...defaultProps}
        onClick={onClick}
      />,
    );

    rerender(
      <ThemeProvider>
        <SudokuCell
          {...defaultProps}
          onClick={onClick}
        />
      </ThemeProvider>,
    );

    expect(onClick).not.toHaveBeenCalled();
  });
});
