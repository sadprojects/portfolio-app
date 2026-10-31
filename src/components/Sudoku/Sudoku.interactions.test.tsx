import { ThemeProvider } from '@contexts/ThemeContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Sudoku } from './Sudoku';

/* A board whose solution is row N filled with N, so 1 is right in row 1 and 5 is wrong; `givens` are pre-filled. */
const board = vi.hoisted(() => ({ givens: [] as [number, number][] }));
vi.mock('./puzzle', async () => ({
  ...(await vi.importActual<typeof import('./puzzle')>('./puzzle')),
  generatePuzzle: () => ({
    puzzle: Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) =>
        board.givens.some(([gr, gc]) => gr === r && gc === c) ? r + 1 : 0,
      ),
    ),
    solution: Array.from({ length: 9 }, (_, row) => Array(9).fill(row + 1)),
  }),
}));
vi.mock('./scores', async () => ({
  ...(await vi.importActual<typeof import('./scores')>('./scores')),
  getHighScores: () => [],
  saveHighScore: vi.fn(),
  isNewBest: () => false,
}));

const cell = (row: number, col: number, value: number | 'empty' = 'empty') =>
  screen.getByLabelText(`Row ${row}, Column ${col}, ${value}`);
const key = (k: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(window, { key: k, ...init });

const renderGame = () =>
  render(
    <ThemeProvider>
      <Sudoku />
    </ThemeProvider>,
  );

describe('Sudoku play', () => {
  beforeEach(() => {
    board.givens = [];
  });

  it('keeps given cells fixed and lights up matching numbers', () => {
    board.givens = [
      [0, 0],
      [0, 1],
    ];
    renderGame();
    const given = cell(1, 1, 1);
    expect(given).toHaveAttribute('data-initial', 'true');
    fireEvent.click(given);
    key('5');
    expect(cell(1, 1, 1)).toBeInTheDocument();
    key('Backspace');
    expect(cell(1, 1, 1)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Number 1'));
    fireEvent.click(cell(1, 2, 1)); // a given cell in held-digit mode just gets selected
    expect(cell(1, 2, 1)).toHaveAttribute('tabindex', '0');
  });

  it('fills, moves, flags errors, erases and undoes from the keyboard', () => {
    renderGame();
    fireEvent.click(cell(1, 1));
    key('1');
    expect(cell(1, 1, 1)).toBeInTheDocument();
    expect(screen.getByText('✓ No errors')).toBeInTheDocument();

    key('ArrowRight');
    key('5');
    expect(cell(1, 2, 5)).toBeInTheDocument();
    expect(screen.getByText('1 error')).toBeInTheDocument();

    key('ArrowUp'); // already on the top row, stays put
    key('ArrowLeft');
    key('ArrowDown');
    expect(cell(2, 1)).toHaveAttribute('tabindex', '0');

    key('ArrowUp');
    key('ArrowRight');
    key('Backspace');
    expect(cell(1, 2)).toBeInTheDocument();

    key('z', { ctrlKey: true });
    expect(cell(1, 2, 5)).toBeInTheDocument();
  });

  it('holds a digit from the number pad and drops it into the cells you click', () => {
    renderGame();
    fireEvent.click(screen.getByLabelText('Number 3'));
    expect(screen.getByText(/3 highlighted/)).toBeInTheDocument();

    fireEvent.click(cell(3, 3));
    expect(cell(3, 3, 3)).toBeInTheDocument();
    expect(screen.getByLabelText('Erase selected cell')).toBeDisabled();

    key('Escape');
    expect(screen.queryByText(/highlighted/)).toBeNull();

    key('4', { shiftKey: true });
    expect(screen.getByText(/4 highlighted/)).toBeInTheDocument();
    key('4', { shiftKey: true });
    expect(screen.queryByText(/highlighted/)).toBeNull();
  });

  it('fills a selected cell from the pad, erases and resets with the buttons', () => {
    renderGame();
    fireEvent.click(cell(2, 2));
    fireEvent.click(screen.getByLabelText('Number 2'));
    expect(cell(2, 2, 2)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Erase selected cell'));
    expect(cell(2, 2)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Undo last action (Ctrl+Z)'));
    expect(cell(2, 2, 2)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Reset puzzle to initial state'));
    expect(cell(2, 2)).toBeInTheDocument();
  });

  it('deselects on a second click or a click outside the board', () => {
    renderGame();
    fireEvent.click(cell(5, 5));
    expect(screen.getByLabelText('Erase selected cell')).toBeEnabled();
    fireEvent.click(cell(5, 5));
    expect(screen.getByLabelText('Erase selected cell')).toBeDisabled();

    fireEvent.click(cell(5, 5));
    fireEvent.mouseDown(document.body);
    expect(screen.getByLabelText('Erase selected cell')).toBeDisabled();
  });

  it('solves itself on the secret code', async () => {
    renderGame();
    'b25111996b'.split('').forEach((k) => key(k));
    expect(await screen.findByText('Puzzle Complete!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Number 7/)).toBeDisabled();
    key('9'); // input after completion is ignored
    key('Backspace');
    key('ArrowDown');
    fireEvent.click(cell(2, 2, 2));
    fireEvent.click(screen.getByLabelText(/Number 7/));
    await waitFor(() =>
      expect(screen.getByText('Puzzle Complete!')).toBeInTheDocument(),
    );
  });
});
