import {
  cloneGrid,
  findErrors,
  generatePuzzle,
  isGridComplete,
} from './puzzle';
import { saveHighScore } from './scores';
import type { CellPosition, SudokuDifficulty, SudokuGameState } from './types';

export type GameAction =
  | { type: 'NEW_GAME'; difficulty: SudokuDifficulty }
  | { type: 'SELECT_CELL'; cell: CellPosition | null }
  | { type: 'SET_VALUE'; value: number }
  | { type: 'CLEAR_CELL' }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'AUTO_SOLVE' };

const elapsedSeconds = (startTime: number) =>
  Math.floor((Date.now() - startTime) / 1000);

export function createInitialState(
  difficulty: SudokuDifficulty,
): SudokuGameState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    grid: cloneGrid(puzzle),
    solution,
    initial: cloneGrid(puzzle),
    selectedCell: null,
    isComplete: false,
    errors: new Set(),
    startTime: Date.now(),
    elapsedTime: 0,
    difficulty,
    history: [],
  };
}

const writeCell = (state: SudokuGameState, value: number): SudokuGameState => {
  if (!state.selectedCell || state.isComplete) return state;
  const { row, col } = state.selectedCell;
  if (state.initial[row][col] !== 0) return state;

  const previousValue = state.grid[row][col];
  if (previousValue === value) return state;

  const grid = cloneGrid(state.grid);
  grid[row][col] = value;
  const history = [...state.history, { row, col, previousValue }];
  const errors = findErrors(grid, state.solution);

  if (value !== 0 && isGridComplete(grid, state.solution)) {
    const elapsed = elapsedSeconds(state.startTime);
    saveHighScore({
      difficulty: state.difficulty,
      time: elapsed,
    });
    return {
      ...state,
      grid,
      errors,
      history,
      isComplete: true,
      elapsedTime: elapsed,
    };
  }
  return { ...state, grid, errors, history };
};

export function gameReducer(
  state: SudokuGameState,
  action: GameAction,
): SudokuGameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState(action.difficulty);

    case 'SELECT_CELL':
      return { ...state, selectedCell: action.cell };

    case 'SET_VALUE':
      return writeCell(state, action.value);

    case 'CLEAR_CELL':
      return writeCell(state, 0);

    case 'UNDO': {
      if (state.history.length === 0 || state.isComplete) return state;
      const history = [...state.history];
      const lastMove = history.pop()!;
      const grid = cloneGrid(state.grid);
      grid[lastMove.row][lastMove.col] = lastMove.previousValue;
      return {
        ...state,
        grid,
        history,
        errors: findErrors(grid, state.solution),
        selectedCell: { row: lastMove.row, col: lastMove.col },
      };
    }

    case 'AUTO_SOLVE':
      if (state.isComplete) return state;
      return {
        ...state,
        grid: cloneGrid(state.solution),
        errors: new Set(),
        isComplete: true,
        elapsedTime: elapsedSeconds(state.startTime),
        selectedCell: null,
      };

    case 'RESET':
      return {
        ...state,
        grid: cloneGrid(state.initial),
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
