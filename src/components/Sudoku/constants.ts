import type { SudokuDifficulty } from './types';

/** Duration in ms for long press to trigger number highlight mode */
export const LONG_PRESS_DURATION = 400;

/** Easter egg: press b, then 25111996, then b again to auto-solve */
export const SECRET_CODE = 'b25111996b';

/** Timeout in ms for secret code entry reset */
export const SECRET_CODE_TIMEOUT = 10000;

/** Available difficulty levels */
export const DIFFICULTIES: SudokuDifficulty[] = [
  'beginner',
  'easy',
  'medium',
  'hard',
  'expert',
];

/** Default difficulty for new games */
export const DEFAULT_DIFFICULTY: SudokuDifficulty = 'medium';
