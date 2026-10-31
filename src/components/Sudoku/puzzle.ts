import {
  BOX_SIZE,
  CELLS_REMOVED_BY_DIFFICULTY,
  DIGITS,
  GRID_SIZE,
} from './constants';
import type { CellPosition, SudokuDifficulty, SudokuGrid } from './types';

export const cellKey = (row: number, col: number) => `${row}-${col}`;

export const cloneGrid = (grid: SudokuGrid): SudokuGrid =>
  grid.map((row) => [...row]);

const emptyGrid = (): SudokuGrid =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const boxStart = (index: number) => Math.floor(index / BOX_SIZE) * BOX_SIZE;

export function isValid(
  puzzle: SudokuGrid,
  row: number,
  col: number,
  value: number,
): boolean {
  const inBounds =
    puzzle?.[row] !== undefined &&
    col >= 0 &&
    col < GRID_SIZE &&
    value >= 1 &&
    value <= GRID_SIZE;
  if (!inBounds) return false;

  if (puzzle[row].includes(value)) return false;
  if (puzzle.some((candidateRow) => candidateRow[col] === value)) return false;

  const firstRow = boxStart(row);
  const firstCol = boxStart(col);
  for (let boxRow = firstRow; boxRow < firstRow + BOX_SIZE; boxRow++) {
    for (let boxCol = firstCol; boxCol < firstCol + BOX_SIZE; boxCol++) {
      if (puzzle[boxRow][boxCol] === value) return false;
    }
  }
  return true;
}

const findEmptyCell = (puzzle: SudokuGrid): CellPosition | null => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (puzzle[row][col] === 0) return { row, col };
    }
  }
  return null;
};

export function solveSudoku(puzzle: SudokuGrid): SudokuGrid | false {
  const grid = cloneGrid(puzzle);

  const fillNext = (): boolean => {
    const empty = findEmptyCell(grid);
    if (!empty) return true;
    const { row, col } = empty;
    for (const digit of DIGITS) {
      if (!isValid(grid, row, col, digit)) continue;
      grid[row][col] = digit;
      if (fillNext()) return true;
      grid[row][col] = 0;
    }
    return false;
  };

  return fillNext() ? grid : false;
}

const shuffle = <T>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapWith]] = [
      shuffled[swapWith],
      shuffled[index],
    ];
  }
  return shuffled;
};

const generateSolvedGrid = (): SudokuGrid => {
  const grid = emptyGrid();
  for (let box = 0; box < BOX_SIZE; box++) {
    const digits = shuffle(DIGITS);
    let next = 0;
    const start = box * BOX_SIZE;
    for (let row = start; row < start + BOX_SIZE; row++) {
      for (let col = start; col < start + BOX_SIZE; col++) {
        grid[row][col] = digits[next++];
      }
    }
  }
  return solveSudoku(grid) || generateSolvedGrid();
};

export function generatePuzzle(difficulty: SudokuDifficulty): {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
} {
  const solution = generateSolvedGrid();
  const puzzle = cloneGrid(solution);
  const cellCount = GRID_SIZE * GRID_SIZE;
  shuffle(Array.from({ length: cellCount }, (_, index) => index))
    .slice(0, CELLS_REMOVED_BY_DIFFICULTY[difficulty])
    .forEach((index) => {
      puzzle[Math.floor(index / GRID_SIZE)][index % GRID_SIZE] = 0;
    });
  return { puzzle, solution };
}

export function isGridComplete(
  grid: SudokuGrid,
  solution: SudokuGrid,
): boolean {
  return grid.every((row, rowIndex) =>
    row.every((value, colIndex) => value === solution[rowIndex][colIndex]),
  );
}

export function findErrors(
  grid: SudokuGrid,
  solution: SudokuGrid,
): Set<string> {
  const errors = new Set<string>();
  grid.forEach((row, rowIndex) =>
    row.forEach((value, colIndex) => {
      if (value !== 0 && value !== solution[rowIndex][colIndex]) {
        errors.add(cellKey(rowIndex, colIndex));
      }
    }),
  );
  return errors;
}

export const remainingByDigit = (grid: SudokuGrid): Record<number, number> => {
  const placed = grid.flat();
  return Object.fromEntries(
    DIGITS.map((digit) => [
      digit,
      GRID_SIZE - placed.filter((value) => value === digit).length,
    ]),
  );
};
