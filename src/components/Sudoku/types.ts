export type SudokuGrid = number[][];
export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CellPosition {
  row: number;
  col: number;
}

interface HistoryEntry {
  row: number;
  col: number;
  previousValue: number;
}

export interface HighScore {
  difficulty: SudokuDifficulty;
  time: number; // in seconds
}

export interface SudokuGameState {
  grid: SudokuGrid;
  solution: SudokuGrid;
  initial: SudokuGrid;
  selectedCell: CellPosition | null;
  isComplete: boolean;
  errors: Set<string>;
  startTime: number;
  elapsedTime: number;
  difficulty: SudokuDifficulty;
  history: HistoryEntry[];
}
