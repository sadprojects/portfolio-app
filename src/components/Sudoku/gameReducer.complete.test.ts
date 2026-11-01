import { createInitialState, gameReducer } from './gameReducer';
import { saveHighScore } from './scores';
import type { SudokuGameState } from './types';

vi.mock('./scores', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./scores')>()),
  saveHighScore: vi.fn(),
}));

/* A valid solved grid, missing only its first cell; (0, 1) is a given. */
const solution = Array.from({ length: 9 }, (_, r) =>
  Array.from(
    { length: 9 },
    (_, c) => ((r * 3 + Math.floor(r / 3) + c) % 9) + 1,
  ),
);
const almostDone = (): SudokuGameState => {
  const grid = solution.map((row) => [...row]);
  grid[0][0] = 0;
  return {
    ...createInitialState('easy'),
    grid,
    solution,
    initial: grid.map((row) => [...row]),
    selectedCell: { row: 0, col: 0 },
    startTime: Date.now() - 65_000,
  };
};

describe('gameReducer edge cases', () => {
  it('completes the puzzle with the last right digit and records the time', () => {
    const done = gameReducer(almostDone(), {
      type: 'SET_VALUE',
      value: solution[0][0],
    });
    expect(done.isComplete).toBe(true);
    expect(done.errors.size).toBe(0);
    expect(done.elapsedTime).toBeGreaterThanOrEqual(65);
    expect(saveHighScore).toHaveBeenCalledWith(
      expect.objectContaining({ difficulty: 'easy', time: done.elapsedTime }),
    );
  });

  it('ignores edits that change nothing', () => {
    const state = almostDone();
    const given = { ...state, selectedCell: { row: 0, col: 1 } };
    expect(gameReducer(given, { type: 'SET_VALUE', value: 9 })).toBe(given);
    expect(gameReducer(given, { type: 'CLEAR_CELL' })).toBe(given);
    expect(gameReducer(state, { type: 'CLEAR_CELL' })).toBe(state);
    const filled = gameReducer(state, { type: 'SET_VALUE', value: 5 });
    expect(gameReducer(filled, { type: 'SET_VALUE', value: 5 })).toBe(filled);
  });

  it('leaves a finished board alone', () => {
    const done = gameReducer(almostDone(), {
      type: 'SET_VALUE',
      value: solution[0][0],
    });
    expect(gameReducer(done, { type: 'AUTO_SOLVE' })).toBe(done);
    expect(gameReducer(done, { type: 'UNDO' })).toBe(done);
    expect(gameReducer(done, { type: 'SET_VALUE', value: 1 })).toBe(done);
    expect(gameReducer(done, { type: 'nope' } as never)).toBe(done);
  });
});
