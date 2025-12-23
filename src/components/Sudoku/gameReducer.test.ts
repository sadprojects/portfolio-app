import { vi } from 'vitest';
import { gameReducer, createInitialState } from './gameReducer';
import type { GameAction } from './gameReducer';
import type { SudokuGameState } from './types';

// Mock sudokuUtils module
vi.mock('./sudokuUtils', () => ({
  generatePuzzle: vi.fn(() => ({
    puzzle: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    solution: Array(9)
      .fill(null)
      .map(() => Array(9).fill(1)),
  })),
  findErrors: vi.fn(() => new Set<string>()),
  isGridComplete: vi.fn(() => false),
  saveHighScore: vi.fn(),
}));

describe('gameReducer', () => {
  let initialState: SudokuGameState;

  beforeEach(() => {
    initialState = createInitialState('medium');
  });

  describe('NEW_GAME action', () => {
    it('should reset state to initial with new puzzle', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: { row: 2, col: 3 },
        elapsedTime: 100,
      };

      const action: GameAction = { type: 'NEW_GAME', difficulty: 'medium' };
      const newState = gameReducer(currentState, action);

      expect(newState.selectedCell).toBeNull();
      expect(newState.elapsedTime).toBe(0);
      expect(newState.isComplete).toBe(false);
      expect(newState.history).toHaveLength(0);
    });

    it('should generate puzzle with specified difficulty', () => {
      const action: GameAction = { type: 'NEW_GAME', difficulty: 'hard' };
      const newState = gameReducer(initialState, action);

      expect(newState.difficulty).toBe('hard');
      expect(newState.grid).toBeDefined();
      expect(newState.solution).toBeDefined();
    });
  });

  describe('SELECT_CELL action', () => {
    it('should select a cell', () => {
      const action: GameAction = {
        type: 'SELECT_CELL',
        cell: { row: 3, col: 4 },
      };
      const newState = gameReducer(initialState, action);

      expect(newState.selectedCell).toEqual({ row: 3, col: 4 });
    });

    it('should update selected cell when selecting different cell', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: { row: 1, col: 1 },
      };

      const action: GameAction = {
        type: 'SELECT_CELL',
        cell: { row: 5, col: 6 },
      };
      const newState = gameReducer(currentState, action);

      expect(newState.selectedCell).toEqual({ row: 5, col: 6 });
    });
  });

  describe('SET_VALUE action', () => {
    it('should set value in selected cell', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: { row: 0, col: 0 },
        grid: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
        initial: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
      };

      const action: GameAction = { type: 'SET_VALUE', value: 5 };
      const newState = gameReducer(currentState, action);

      expect(newState.grid[0][0]).toBe(5);
    });

    it('should not set value if no cell is selected', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: null,
        grid: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
      };

      const action: GameAction = { type: 'SET_VALUE', value: 5 };
      const newState = gameReducer(currentState, action);

      expect(newState.grid).toEqual(currentState.grid);
    });

    it('should not set value in initial cell', () => {
      const initial = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      initial[0][0] = 3;

      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: { row: 0, col: 0 },
        grid: initial.map((row) => [...row]),
        initial,
      };

      const action: GameAction = { type: 'SET_VALUE', value: 5 };
      const newState = gameReducer(currentState, action);

      expect(newState.grid[0][0]).toBe(3);
    });

    it('should add to history when setting value', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: { row: 0, col: 0 },
        grid: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
        initial: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
        history: [],
      };

      const action: GameAction = { type: 'SET_VALUE', value: 5 };
      const newState = gameReducer(currentState, action);

      expect(newState.history.length).toBeGreaterThan(0);
    });
  });

  describe('CLEAR_CELL action', () => {
    it('should clear selected cell', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      grid[1][1] = 5;

      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: { row: 1, col: 1 },
        grid,
        initial: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
      };

      const action: GameAction = { type: 'CLEAR_CELL' };
      const newState = gameReducer(currentState, action);

      expect(newState.grid[1][1]).toBe(0);
    });

    it('should not clear if no cell is selected', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        selectedCell: null,
      };

      const action: GameAction = { type: 'CLEAR_CELL' };
      const newState = gameReducer(currentState, action);

      expect(newState.grid).toEqual(currentState.grid);
    });
  });

  describe('UNDO action', () => {
    it('should restore previous value from history', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      grid[0][0] = 5;

      const currentState: SudokuGameState = {
        ...initialState,
        grid,
        history: [{ row: 0, col: 0, previousValue: 0, newValue: 5 }],
      };

      const action: GameAction = { type: 'UNDO' };
      const newState = gameReducer(currentState, action);

      expect(newState.grid[0][0]).toBe(0);
      expect(newState.history).toHaveLength(0);
      expect(newState.selectedCell).toEqual({ row: 0, col: 0 });
    });

    it('should not change state if history is empty', () => {
      const currentState: SudokuGameState = {
        ...initialState,
        history: [],
      };

      const action: GameAction = { type: 'UNDO' };
      const newState = gameReducer(currentState, action);

      expect(newState.grid).toEqual(currentState.grid);
      expect(newState.history).toHaveLength(0);
    });
  });

  describe('RESET action', () => {
    it('should reset grid to initial state', () => {
      const initial = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      initial[0][0] = 5;

      const grid = initial.map((row) => [...row]);
      grid[1][1] = 7;

      const currentState: SudokuGameState = {
        ...initialState,
        grid,
        initial,
        history: [{ row: 1, col: 1, previousValue: 0, newValue: 7 }],
      };

      const action: GameAction = { type: 'RESET' };
      const newState = gameReducer(currentState, action);

      expect(newState.grid).toEqual(initial);
      expect(newState.history).toHaveLength(0);
      expect(newState.isComplete).toBe(false);
      expect(newState.selectedCell).toBeNull();
    });
  });

  describe('AUTO_SOLVE action', () => {
    it('should set grid to solution', () => {
      const solution = Array(9)
        .fill(null)
        .map(() => Array(9).fill(9));

      const currentState: SudokuGameState = {
        ...initialState,
        solution,
        grid: Array(9)
          .fill(null)
          .map(() => Array(9).fill(0)),
      };

      const action: GameAction = { type: 'AUTO_SOLVE' };
      const newState = gameReducer(currentState, action);

      expect(newState.grid).toEqual(solution);
      expect(newState.isComplete).toBe(true);
      expect(newState.selectedCell).toBeNull();
    });
  });
});
