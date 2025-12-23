export type SudokuGrid = number[][];
export type SudokuDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface CellPosition {
  row: number;
  col: number;
}

export interface HistoryEntry {
  row: number;
  col: number;
  previousValue: number;
  newValue: number;
}

export interface HighScore {
  difficulty: SudokuDifficulty;
  time: number; // in seconds
  date: string;
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
