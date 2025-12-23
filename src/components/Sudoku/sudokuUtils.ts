import type { HighScore, SudokuDifficulty, SudokuGrid } from './types';

const STORAGE_KEY = 'sudoku_highscores';

/**
 * Check if a value is valid at position (r, c) in the puzzle
 */
export function isValid(
  puzzle: SudokuGrid,
  r: number,
  c: number,
  val: number,
): boolean {
  if (
    puzzle == null ||
    !Array.isArray(puzzle) ||
    r == null ||
    c == null ||
    !Number.isInteger(r) ||
    !Number.isInteger(c) ||
    r < 0 ||
    r > 8 ||
    c < 0 ||
    c > 8 ||
    !Number.isInteger(val) ||
    val < 1 ||
    val > 9
  ) {
    return false;
  }

  // Check if any value matches on specified row
  for (const currValue of puzzle[r]) {
    if (val === currValue) {
      return false;
    }
  }

  // Check if any value matches on specified column
  for (const currRow of puzzle) {
    if (val === currRow[c]) {
      return false;
    }
  }

  // Check if number exists in 3x3 box
  const currBoxRowStart = Math.floor(r / 3) * 3;
  const currBoxColStart = Math.floor(c / 3) * 3;

  for (let row = currBoxRowStart; row < currBoxRowStart + 3; row++) {
    for (let col = currBoxColStart; col < currBoxColStart + 3; col++) {
      if (puzzle[row][col] === val) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Find the first empty cell (value = 0) in the puzzle
 */
function findEmpty(puzzle: SudokuGrid): { r: number; c: number } | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] === 0) {
        return { r, c };
      }
    }
  }
  return null;
}

/**
 * Solve the sudoku puzzle using backtracking
 */
export function solveSudoku(puzzle: SudokuGrid): SudokuGrid | false {
  const copy = puzzle.map((row) => [...row]);

  function solve(grid: SudokuGrid): boolean {
    const emptyPos = findEmpty(grid);
    if (!emptyPos) {
      return true;
    }

    const { r, c } = emptyPos;

    for (let value = 1; value <= 9; value++) {
      if (isValid(grid, r, c, value)) {
        grid[r][c] = value;

        if (solve(grid)) {
          return true;
        }

        grid[r][c] = 0;
      }
    }

    return false;
  }

  if (solve(copy)) {
    return copy;
  }
  return false;
}

/**
 * Generate a complete valid sudoku grid
 */
function generateCompleteGrid(): SudokuGrid {
  const grid: SudokuGrid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes first (they don't affect each other)
  for (let box = 0; box < 3; box++) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let idx = 0;
    for (let r = box * 3; r < box * 3 + 3; r++) {
      for (let c = box * 3; c < box * 3 + 3; c++) {
        grid[r][c] = nums[idx++];
      }
    }
  }

  // Solve the rest and return the completed grid
  const solved = solveSudoku(grid);
  if (solved) {
    return solved;
  }
  
  // Fallback: if solving failed, try again with a fresh grid
  return generateCompleteGrid();
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Get number of cells to remove based on difficulty
 */
function getCellsToRemove(difficulty: SudokuDifficulty): number {
  switch (difficulty) {
    case 'beginner':
      return 25; // ~56 clues remaining - very easy
    case 'easy':
      return 35; // ~46 clues remaining
    case 'medium':
      return 45; // ~36 clues remaining
    case 'hard':
      return 52; // ~29 clues remaining
    case 'expert':
      return 58; // ~23 clues remaining - very hard
    default:
      return 40;
  }
}

/**
 * Generate a new sudoku puzzle with given difficulty
 */
export function generatePuzzle(difficulty: SudokuDifficulty): {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
} {
  const solution = generateCompleteGrid();
  const puzzle = solution.map((row) => [...row]);

  const cellsToRemove = getCellsToRemove(difficulty);
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => ({
      row: Math.floor(i / 9),
      col: i % 9,
    })),
  );

  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;

    puzzle[row][col] = 0;
    removed++;

    // For hard mode, we could add uniqueness check but it's expensive
    if (difficulty === 'hard' && removed > 50) {
      // For very hard puzzles, we might want to restore some cells
      // to ensure solvability without being too easy
    }
  }

  return { puzzle, solution };
}

/**
 * Check if the current grid matches the solution
 */
export function isGridComplete(
  grid: SudokuGrid,
  solution: SudokuGrid,
): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Find all errors in the current grid compared to solution
 */
export function findErrors(
  grid: SudokuGrid,
  solution: SudokuGrid,
): Set<string> {
  const errors = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0 && grid[r][c] !== solution[r][c]) {
        errors.add(`${r}-${c}`);
      }
    }
  }
  return errors;
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get high scores from localStorage
 */
export function getHighScores(): HighScore[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new high score (only keeps the best time per difficulty)
 */
export function saveHighScore(score: HighScore): void {
  try {
    const scores = getHighScores();
    
    // Find existing score for this difficulty
    const existingIndex = scores.findIndex((s) => s.difficulty === score.difficulty);
    
    if (existingIndex >= 0) {
      // Only replace if new time is better
      if (score.time < scores[existingIndex].time) {
        scores[existingIndex] = score;
      }
    } else {
      // No existing score for this difficulty, add it
      scores.push(score);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // localStorage not available
  }
}

/**
 * Check if this time is a new best for the difficulty
 */
export function isNewBest(difficulty: SudokuDifficulty, time: number): boolean {
  const scores = getHighScores().filter((s) => s.difficulty === difficulty);
  if (scores.length === 0) return true;
  return time < Math.min(...scores.map((s) => s.time));
}
