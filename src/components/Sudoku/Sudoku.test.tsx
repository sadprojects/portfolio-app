import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vite-plus/test';

import * as puzzle from './puzzle';
import * as scores from './scores';
import { Sudoku } from './Sudoku';

vi.mock('./puzzle', async () => ({
  ...(await vi.importActual<typeof import('./puzzle')>('./puzzle')),
  generatePuzzle: vi.fn(() => ({
    puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
    solution: Array.from({ length: 9 }, (_, row) => Array(9).fill(row + 1)),
  })),
}));
vi.mock('./scores', async () => ({
  ...(await vi.importActual<typeof import('./scores')>('./scores')),
  getHighScores: vi.fn(() => []),
  saveHighScore: vi.fn(),
  isNewBest: vi.fn(() => false),
}));

describe('Sudoku', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithTheme(<Sudoku />);
    expect(screen.getByLabelText('Sudoku puzzle grid')).toBeInTheDocument();
  });

  it('should render difficulty tabs', () => {
    renderWithTheme(<Sudoku />);
    expect(screen.getByText(/easy/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
    expect(screen.getByText(/expert/i)).toBeInTheDocument();
  });

  it('should render number buttons', () => {
    renderWithTheme(<Sudoku />);
    for (let i = 1; i <= 9; i++) {
      expect(
        screen.getByLabelText(new RegExp(`Number ${i}`, 'i')),
      ).toBeInTheDocument();
    }
  });

  it('should render action buttons', () => {
    renderWithTheme(<Sudoku />);
    expect(screen.getByLabelText(/Undo last action/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Erase selected cell/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Reset puzzle to initial state/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Start new medium game/i)).toBeInTheDocument();
  });

  it('should render timer', () => {
    renderWithTheme(<Sudoku />);
    expect(screen.getByText(/00:00/i)).toBeInTheDocument();
  });

  it('should render error badge', () => {
    renderWithTheme(<Sudoku />);
    expect(screen.getByText(/No errors/i)).toBeInTheDocument();
  });

  it('should start new game when difficulty tab is clicked', () => {
    renderWithTheme(<Sudoku />);
    const hardTab = screen.getByText(/hard/i);
    fireEvent.click(hardTab);

    expect(puzzle.generatePuzzle).toHaveBeenCalledWith('hard');
  });

  it('should start new game when New Game button is clicked', () => {
    renderWithTheme(<Sudoku />);
    const newGameButton = screen.getByRole('button', {
      name: /Start new medium game/i,
    });
    fireEvent.click(newGameButton);

    expect(puzzle.generatePuzzle).toHaveBeenCalled();
  });

  it('should have grid cells', () => {
    renderWithTheme(<Sudoku />);
    const allButtons = screen.getAllByRole('button');
    const cells = allButtons.filter((btn) => {
      const label = btn.getAttribute('aria-label');
      return label?.includes('Row') || label?.includes('empty');
    });
    expect(cells.length).toBe(81); // 9x9 grid
  });

  it('should render 81 cells in the grid', () => {
    const { container } = renderWithTheme(<Sudoku />);
    const grid = container.querySelector('[aria-label="Sudoku puzzle grid"]');
    const cells = grid?.querySelectorAll('button');
    expect(cells?.length).toBe(81);
  });

  it('should disable undo button when no history', () => {
    renderWithTheme(<Sudoku />);
    const undoButton = screen.getByLabelText(/Undo/i);
    expect(undoButton).toBeDisabled();
  });

  it('should disable erase button when no cell selected', () => {
    renderWithTheme(<Sudoku />);
    const eraseButton = screen.getByLabelText(/Erase/i);
    expect(eraseButton).toBeDisabled();
  });

  it('should call generatePuzzle on mount', () => {
    renderWithTheme(<Sudoku />);
    expect(puzzle.generatePuzzle).toHaveBeenCalledWith('medium');
  });

  it('should show high score section when best time exists', () => {
    vi.mocked(scores.getHighScores).mockReturnValue([
      { difficulty: 'medium', time: 120 },
    ]);

    renderWithTheme(<Sudoku />);
    expect(screen.getByText(/Best Time/i)).toBeInTheDocument();
    expect(screen.getByText(/02:00/i)).toBeInTheDocument();
  });

  it('should handle keyboard input for numbers', () => {
    renderWithTheme(<Sudoku />);

    // Press a number key
    fireEvent.keyDown(window, { key: '5' });

    // Number should be highlighted or processed
    expect(screen.getByLabelText(/Number 5/i)).toBeInTheDocument();
  });

  it('should handle Escape key', () => {
    renderWithTheme(<Sudoku />);

    fireEvent.keyDown(window, { key: 'Escape' });

    // Should deselect any selected cell
    const eraseButton = screen.getByLabelText(/Erase/i);
    expect(eraseButton).toBeDisabled();
  });

  it('should render all 9 boxes', () => {
    const { container } = renderWithTheme(<Sudoku />);
    const grid = container.querySelector('[aria-label="Sudoku puzzle grid"]');
    const boxes = grid?.children;
    expect(boxes?.length).toBe(9);
  });

  it('should update difficulty when tab is clicked', async () => {
    renderWithTheme(<Sudoku />);

    const easyTab = screen.getByText(/^easy$/i);
    fireEvent.click(easyTab);

    await waitFor(() => {
      expect(easyTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('should show numbers label', () => {
    renderWithTheme(<Sudoku />);
    expect(screen.getByText(/Numbers/i)).toBeInTheDocument();
  });

  it('should render status bar', () => {
    const { container } = renderWithTheme(<Sudoku />);
    const statusBar = container.querySelector('[role="status"]');
    expect(statusBar).toBeInTheDocument();
  });
});
