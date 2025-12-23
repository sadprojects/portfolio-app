import {
  findErrors,
  generatePuzzle,
  isGridComplete,
  saveHighScore,
} from './sudokuUtils';
import type { CellPosition, SudokuDifficulty, SudokuGameState } from './types';

export type GameAction =
  | { type: 'NEW_GAME'; difficulty: SudokuDifficulty }
  | { type: 'SELECT_CELL'; cell: CellPosition }
  | { type: 'SET_VALUE'; value: number }
  | { type: 'CLEAR_CELL' }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'AUTO_SOLVE' };

export function createInitialState(
  difficulty: SudokuDifficulty,
): SudokuGameState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    grid: puzzle.map((row) => [...row]),
    solution,
    initial: puzzle.map((row) => [...row]),
    selectedCell: null,
    isComplete: false,
    errors: new Set(),
    startTime: Date.now(),
    elapsedTime: 0,
    difficulty,
    history: [],
  };
}

export function gameReducer(
  state: SudokuGameState,
  action: GameAction,
): SudokuGameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState(action.difficulty);

    case 'SELECT_CELL': {
      return { ...state, selectedCell: action.cell };
    }

    case 'SET_VALUE': {
      if (!state.selectedCell || state.isComplete) return state;
      const { row, col } = state.selectedCell;
      if (state.initial[row][col] !== 0) return state;

      const previousValue = state.grid[row][col];
      // Don't add to history if value is the same
      if (previousValue === action.value) return state;

      const newGrid = state.grid.map((r) => [...r]);
      newGrid[row][col] = action.value;

      const errors = findErrors(newGrid, state.solution);
      const isComplete = isGridComplete(newGrid, state.solution);

      // Add to history
      const historyEntry = { row, col, previousValue, newValue: action.value };
      const newHistory = [...state.history, historyEntry];

      if (isComplete) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        saveHighScore({
          difficulty: state.difficulty,
          time: elapsed,
          date: new Date().toISOString(),
        });
        return {
          ...state,
          grid: newGrid,
          errors,
          isComplete,
          elapsedTime: elapsed,
          history: newHistory,
        };
      }

      return { ...state, grid: newGrid, errors, history: newHistory };
    }

    case 'CLEAR_CELL': {
      if (!state.selectedCell || state.isComplete) return state;
      const { row, col } = state.selectedCell;
      if (state.initial[row][col] !== 0) return state;

      const previousValue = state.grid[row][col];
      // Don't add to history if already empty
      if (previousValue === 0) return state;

      const newGrid = state.grid.map((r) => [...r]);
      newGrid[row][col] = 0;

      // Add to history
      const historyEntry = { row, col, previousValue, newValue: 0 };
      const newHistory = [...state.history, historyEntry];

      const errors = findErrors(newGrid, state.solution);
      return { ...state, grid: newGrid, errors, history: newHistory };
    }

    case 'UNDO': {
      if (state.history.length === 0 || state.isComplete) return state;

      const newHistory = [...state.history];
      const lastAction = newHistory.pop()!;

      const newGrid = state.grid.map((r) => [...r]);
      newGrid[lastAction.row][lastAction.col] = lastAction.previousValue;

      const errors = findErrors(newGrid, state.solution);
      return {
        ...state,
        grid: newGrid,
        errors,
        history: newHistory,
        selectedCell: { row: lastAction.row, col: lastAction.col },
      };
    }

    case 'AUTO_SOLVE': {
      if (state.isComplete) return state;
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      // Don't save to high scores for auto-solve
      return {
        ...state,
        grid: state.solution.map((r) => [...r]),
        errors: new Set(),
        isComplete: true,
        elapsedTime: elapsed,
        selectedCell: null,
      };
    }

    case 'RESET':
      return {
        ...state,
        grid: state.initial.map((r) => [...r]),
        selectedCell: null,
        isComplete: false,
        errors: new Set(),
        startTime: Date.now(),
        elapsedTime: 0,
        history: [],
      };

    default:
      return state;
  }
}
