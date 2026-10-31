import type { HighScore, SudokuDifficulty } from './types';

const STORAGE_KEY = 'sudoku_highscores';
const SECONDS_PER_MINUTE = 60;

const twoDigits = (value: number) => value.toString().padStart(2, '0');

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  return `${twoDigits(minutes)}:${twoDigits(seconds % SECONDS_PER_MINUTE)}`;
}

export function getHighScores(): HighScore[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveHighScore(score: HighScore): void {
  try {
    const scores = getHighScores();
    const existing = scores.findIndex(
      (candidate) => candidate.difficulty === score.difficulty,
    );
    if (existing === -1) scores.push(score);
    else if (score.time < scores[existing].time) scores[existing] = score;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    return;
  }
}

export function isNewBest(difficulty: SudokuDifficulty, time: number): boolean {
  const times = getHighScores()
    .filter((score) => score.difficulty === difficulty)
    .map((score) => score.time);
  return times.length === 0 || time < Math.min(...times);
}
