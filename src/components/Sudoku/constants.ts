import type { SudokuDifficulty } from './types';

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const SECRET_CODE = 'b25111996b';
export const SECRET_CODE_TIMEOUT_MS = 10_000;

export const DIFFICULTIES: SudokuDifficulty[] = [
  'easy',
  'medium',
  'hard',
  'expert',
];

export const DEFAULT_DIFFICULTY: SudokuDifficulty = 'medium';

export const CELLS_REMOVED_BY_DIFFICULTY: Record<SudokuDifficulty, number> = {
  easy: 35,
  medium: 45,
  hard: 52,
  expert: 58,
};
