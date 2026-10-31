import { Eraser, RefreshCw, RotateCcw, Undo2 } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Board } from './Board';
import { Timer } from './components/Timer';
import { WinOverlay } from './components/WinOverlay';
import { DEFAULT_DIFFICULTY, DIFFICULTIES, DIGITS } from './constants';
import { createInitialState, gameReducer } from './gameReducer';
import { remainingByDigit } from './puzzle';
import { formatTime, getHighScores, isNewBest } from './scores';
import {
  ActionButton,
  ActionRow,
  BoardFrame,
  BoardSection,
  ControlGroup,
  ControlLabel,
  ControlsSection,
  DifficultyTab,
  DifficultyTabs,
  ErrorBadge,
  GameContainer,
  HighScoreItem,
  NumberButton,
  NumberPad,
  StatusBar,
} from './Sudoku.styles';
import type { SudokuDifficulty } from './types';
import { useSecretCode } from './useSecretCode';
import { useSudokuKeyboard } from './useSudokuKeyboard';

const DIFFICULTY_EMOJI: Partial<Record<SudokuDifficulty, string>> = {
  beginner: '👶',
  expert: '🔥',
};

const errorSummary = (count: number) =>
  count === 0 ? '✓ No errors' : `${count} error${count > 1 ? 's' : ''}`;

export const Sudoku = () => {
  const [state, dispatch] = useReducer(
    gameReducer,
    DEFAULT_DIFFICULTY,
    createInitialState,
  );
  const [heldDigit, setHeldDigit] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const secret = useSecretCode(() => dispatch({ type: 'AUTO_SOLVE' }));

  const toggleHeldDigit = (digit: number) =>
    setHeldDigit((current) => (current === digit ? null : digit));
  const releaseDigit = () => setHeldDigit(null);

  useSudokuKeyboard({
    selectedCell: state.selectedCell,
    isComplete: state.isComplete,
    dispatch,
    toggleHighlight: toggleHeldDigit,
    clearHighlight: releaseDigit,
    secret,
  });

  useEffect(() => {
    setHeldDigit(null);
  }, [state.startTime]);

  useEffect(() => {
    const deselectOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      dispatch({ type: 'SELECT_CELL', cell: null });
      setHeldDigit(null);
    };
    document.addEventListener('mousedown', deselectOnOutsideClick);
    return () =>
      document.removeEventListener('mousedown', deselectOnOutsideClick);
  }, []);

  const onCellClick = (row: number, col: number) => {
    const alreadySelected =
      state.selectedCell?.row === row && state.selectedCell?.col === col;
    if (alreadySelected) {
      dispatch({ type: 'SELECT_CELL', cell: null });
      return;
    }
    const canDropHeldDigit =
      heldDigit !== null && state.initial[row][col] === 0 && !state.isComplete;
    dispatch({ type: 'SELECT_CELL', cell: { row, col } });
    if (canDropHeldDigit) {
      dispatch({ type: 'SET_VALUE', value: heldDigit });
      dispatch({ type: 'SELECT_CELL', cell: null });
    }
  };

  const onDigitClick = (digit: number) => {
    secret.track(String(digit));
    if (state.isComplete) return;
    if (state.selectedCell) dispatch({ type: 'SET_VALUE', value: digit });
    else toggleHeldDigit(digit);
  };

  const startNewGame = (difficulty: SudokuDifficulty) => {
    dispatch({ type: 'NEW_GAME', difficulty });
    releaseDigit();
    secret.reset();
  };

  const resetPuzzle = () => {
    dispatch({ type: 'RESET' });
    releaseDigit();
    secret.reset();
  };

  const bestTime =
    getHighScores().find((score) => score.difficulty === state.difficulty) ??
    null;
  const isNewBestTime =
    state.isComplete && isNewBest(state.difficulty, state.elapsedTime);
  const remaining = remainingByDigit(state.grid);

  return (
    <GameContainer ref={containerRef}>
      <BoardSection>
        <StatusBar>
          <Timer startTime={state.startTime} isComplete={state.isComplete} />
          <ErrorBadge
            $hasErrors={state.errors.size > 0}
            role="status"
            aria-live="polite"
          >
            {errorSummary(state.errors.size)}
          </ErrorBadge>
        </StatusBar>

        <BoardFrame>
          <Board
            state={state}
            heldDigit={heldDigit}
            onCellClick={onCellClick}
          />
          <WinOverlay
            isComplete={state.isComplete}
            elapsedTime={state.elapsedTime}
            isNewBestTime={isNewBestTime}
            difficulty={state.difficulty}
            onPlayAgain={startNewGame}
          />
        </BoardFrame>
      </BoardSection>

      <ControlsSection>
        <ControlGroup>
          <ControlLabel id="difficulty-label">Difficulty</ControlLabel>
          <DifficultyTabs role="tablist" aria-labelledby="difficulty-label">
            {DIFFICULTIES.map((difficulty) => (
              <DifficultyTab
                key={difficulty}
                role="tab"
                $isActive={state.difficulty === difficulty}
                aria-selected={state.difficulty === difficulty}
                onClick={() => startNewGame(difficulty)}
                data-active={state.difficulty === difficulty}
              >
                {DIFFICULTY_EMOJI[difficulty] ?? ''} {difficulty}
              </DifficultyTab>
            ))}
          </DifficultyTabs>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel id="numbers-label">
            Numbers {heldDigit && `(${heldDigit} highlighted)`}
          </ControlLabel>
          <NumberPad role="group" aria-labelledby="numbers-label">
            {DIGITS.map((digit) => (
              <NumberButton
                key={digit}
                $isActive={heldDigit === digit}
                onClick={() => onDigitClick(digit)}
                disabled={state.isComplete || remaining[digit] === 0}
                aria-label={`Number ${digit}${remaining[digit] === 0 ? ', completed' : ''}`}
                aria-pressed={heldDigit === digit}
              >
                {digit}
              </NumberButton>
            ))}
          </NumberPad>
        </ControlGroup>

        <ActionRow>
          <ActionButton
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.history.length === 0 || state.isComplete}
            aria-label="Undo last action (Ctrl+Z)"
          >
            <Undo2 size={16} aria-hidden="true" />
            Undo
          </ActionButton>
          <ActionButton
            onClick={() => dispatch({ type: 'CLEAR_CELL' })}
            disabled={!state.selectedCell || state.isComplete}
            aria-label="Erase selected cell"
          >
            <Eraser size={16} aria-hidden="true" />
            Erase
          </ActionButton>
          <ActionButton
            onClick={resetPuzzle}
            aria-label="Reset puzzle to initial state"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </ActionButton>
        </ActionRow>

        <ActionButton
          $variant="primary"
          onClick={() => startNewGame(state.difficulty)}
          aria-label={`Start new ${state.difficulty} game`}
        >
          <RefreshCw size={16} aria-hidden="true" />
          New Game
        </ActionButton>

        {bestTime && (
          <ControlGroup>
            <ControlLabel>Best Time</ControlLabel>
            <HighScoreItem $rank={1} role="status">
              <span>🏆</span>
              <span>{formatTime(bestTime.time)}</span>
            </HighScoreItem>
          </ControlGroup>
        )}
      </ControlsSection>
    </GameContainer>
  );
};

export default Sudoku;
