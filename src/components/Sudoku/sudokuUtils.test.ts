import {
  formatTime,
  getHighScores,
  saveHighScore,
  isNewBest,
  isGridComplete,
  findErrors,
  isValid,
} from './sudokuUtils';
import type { SudokuGrid } from './types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('sudokuUtils', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('formatTime', () => {
    it('should format 0 seconds as 00:00', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should format seconds without minutes', () => {
      expect(formatTime(45)).toBe('00:45');
    });

    it('should format minutes and seconds', () => {
      expect(formatTime(125)).toBe('02:05');
    });

    it('should pad single digits', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(5)).toBe('00:05');
    });

    it('should handle large times', () => {
      expect(formatTime(3661)).toBe('61:01');
    });
  });

  describe('getHighScores', () => {
    it('should return empty array when no scores exist', () => {
      expect(getHighScores()).toEqual([]);
    });

    it('should return stored scores', () => {
      const scores = [
        { difficulty: 'easy' as const, time: 120, date: '2024-01-01' },
        { difficulty: 'medium' as const, time: 180, date: '2024-01-02' },
      ];
      localStorage.setItem('sudoku_highscores', JSON.stringify(scores));

      expect(getHighScores()).toEqual(scores);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('sudoku_highscores', 'invalid json');
      expect(getHighScores()).toEqual([]);
    });
  });

  describe('saveHighScore', () => {
    it('should save first score for difficulty', () => {
      const score = {
        difficulty: 'easy' as const,
        time: 120,
        date: '2024-01-01',
      };
      saveHighScore(score);

      const scores = getHighScores();
      expect(scores).toHaveLength(1);
      expect(scores[0]).toEqual(score);
    });

    it('should replace score if new time is better', () => {
      const oldScore = {
        difficulty: 'easy' as const,
        time: 180,
        date: '2024-01-01',
      };
      const newScore = {
        difficulty: 'easy' as const,
        time: 120,
        date: '2024-01-02',
      };

      saveHighScore(oldScore);
      saveHighScore(newScore);

      const scores = getHighScores();
      expect(scores).toHaveLength(1);
      expect(scores[0].time).toBe(120);
    });

    it('should not replace score if new time is worse', () => {
      const oldScore = {
        difficulty: 'easy' as const,
        time: 120,
        date: '2024-01-01',
      };
      const newScore = {
        difficulty: 'easy' as const,
        time: 180,
        date: '2024-01-02',
      };

      saveHighScore(oldScore);
      saveHighScore(newScore);

      const scores = getHighScores();
      expect(scores).toHaveLength(1);
      expect(scores[0].time).toBe(120);
    });

    it('should keep separate scores for different difficulties', () => {
      const easyScore = {
        difficulty: 'easy' as const,
        time: 120,
        date: '2024-01-01',
      };
      const hardScore = {
        difficulty: 'hard' as const,
        time: 300,
        date: '2024-01-02',
      };

      saveHighScore(easyScore);
      saveHighScore(hardScore);

      const scores = getHighScores();
      expect(scores).toHaveLength(2);
    });
  });

  describe('isNewBest', () => {
    it('should return true for first score', () => {
      expect(isNewBest('easy', 120)).toBe(true);
    });

    it('should return true for better time', () => {
      saveHighScore({
        difficulty: 'easy' as const,
        time: 180,
        date: '2024-01-01',
      });
      expect(isNewBest('easy', 120)).toBe(true);
    });

    it('should return false for worse time', () => {
      saveHighScore({
        difficulty: 'easy' as const,
        time: 120,
        date: '2024-01-01',
      });
      expect(isNewBest('easy', 180)).toBe(false);
    });

    it('should check correct difficulty', () => {
      saveHighScore({
        difficulty: 'easy' as const,
        time: 120,
        date: '2024-01-01',
      });
      expect(isNewBest('hard', 180)).toBe(true);
    });
  });

  describe('isGridComplete', () => {
    it('should return true for matching grids', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      expect(isGridComplete(grid, grid)).toBe(true);
    });

    it('should return false for non-matching grids', () => {
      const grid1: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      const grid2: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(3));
      expect(isGridComplete(grid1, grid2)).toBe(false);
    });

    it('should return false if any cell differs', () => {
      const grid1: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      const grid2: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      grid2[4][4] = 3;
      expect(isGridComplete(grid1, grid2)).toBe(false);
    });
  });

  describe('findErrors', () => {
    it('should return empty set for correct grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      const errors = findErrors(grid, grid);
      expect(errors.size).toBe(0);
    });

    it('should detect errors', () => {
      const solution: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      grid[0][0] = 3;
      grid[1][1] = 7;

      const errors = findErrors(grid, solution);
      expect(errors.size).toBe(2);
      expect(errors.has('0-0')).toBe(true);
      expect(errors.has('1-1')).toBe(true);
    });

    it('should not flag zeros as errors', () => {
      const solution: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));
      grid[0][0] = 0;

      const errors = findErrors(grid, solution);
      expect(errors.size).toBe(0);
    });
  });

  describe('isValid', () => {
    const emptyGrid: SudokuGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

    it('should return true for valid placement in empty cell', () => {
      expect(isValid(emptyGrid, 0, 0, 1)).toBe(true);
      expect(isValid(emptyGrid, 4, 4, 5)).toBe(true);
      expect(isValid(emptyGrid, 8, 8, 9)).toBe(true);
    });

    it('should return false for invalid row parameters', () => {
      expect(isValid(emptyGrid, -1, 0, 1)).toBe(false);
      expect(isValid(emptyGrid, 9, 0, 1)).toBe(false);
    });

    it('should return false for invalid column parameters', () => {
      expect(isValid(emptyGrid, 0, -1, 1)).toBe(false);
      expect(isValid(emptyGrid, 0, 9, 1)).toBe(false);
    });

    it('should return false for invalid value parameters', () => {
      expect(isValid(emptyGrid, 0, 0, 0)).toBe(false);
      expect(isValid(emptyGrid, 0, 0, 10)).toBe(false);
    });

    it('should return false for duplicate in row', () => {
      const grid: SudokuGrid = emptyGrid.map((row) => [...row]);
      grid[0][3] = 5;
      expect(isValid(grid, 0, 0, 5)).toBe(false);
    });

    it('should return false for duplicate in column', () => {
      const grid: SudokuGrid = emptyGrid.map((row) => [...row]);
      grid[5][0] = 7;
      expect(isValid(grid, 0, 0, 7)).toBe(false);
    });

    it('should return false for duplicate in 3x3 box', () => {
      const grid: SudokuGrid = emptyGrid.map((row) => [...row]);
      grid[1][1] = 3;
      expect(isValid(grid, 0, 0, 3)).toBe(false);
    });

    it('should return false for null puzzle', () => {
      expect(isValid(null as unknown as SudokuGrid, 0, 0, 1)).toBe(false);
    });
  });
});
