import { Eraser, RefreshCw, RotateCcw, Undo2 } from 'lucide-react';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { SudokuCell, Timer, WinOverlay } from './components';
import { SECRET_CODE, SECRET_CODE_TIMEOUT } from './constants';
import { createInitialState, gameReducer } from './gameReducer';
import {
  ActionButton,
  ActionRow,
  BoardSection,
  Box,
  ControlsSection,
  DifficultyTab,
  DifficultyTabs,
  ErrorBadge,
  GameContainer,
  Grid,
  GridWrapper,
  HighScoreItem,
  NumberButton,
  NumberPad,
  ScreenReaderOnly,
  Section,
  SectionLabel,
  StatusBar,
} from './Sudoku.styles';
import { formatTime, getHighScores, isNewBest } from './sudokuUtils';
import type { CellPosition, SudokuDifficulty } from './types';

export const Sudoku = memo(() => {
  const [state, dispatch] = useReducer(
    gameReducer,
    'medium',
    createInitialState,
  );

  // Track selected number for "number highlight" mode (triggered by long press)
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(
    null,
  );
  // Track secret code entry for easter egg (value is used functionally via setSecretInput)
  const [, setSecretInput] = useState('');
  const announcementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const secretTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset highlighted number when game changes
  useEffect(() => {
    setHighlightedNumber(null);
  }, [state.startTime]);

  // Click outside handler to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        dispatch({
          type: 'SELECT_CELL',
          cell: null as unknown as CellPosition,
        });
        setHighlightedNumber(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Z / Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
        return;
      }

      const key = e.key.toLowerCase();

      // Track 'b' key for secret code wrapper
      if (key === 'b') {
        setSecretInput((prev) => {
          const newInput = prev + 'b';
          if (secretTimeoutRef.current) {
            clearTimeout(secretTimeoutRef.current);
          }
          secretTimeoutRef.current = setTimeout(() => {
            setSecretInput('');
          }, SECRET_CODE_TIMEOUT);

          if (newInput === SECRET_CODE) {
            // Use setTimeout to ensure dispatch happens after state update
            setTimeout(() => dispatch({ type: 'AUTO_SOLVE' }), 0);
            return '';
          }
          return newInput.slice(-SECRET_CODE.length);
        });
        return;
      }

      if (key >= '1' && key <= '9') {
        const num = parseInt(key);

        // Track secret code input (works even when game is complete)
        setSecretInput((prev) => {
          // Only track numbers if we've started with 'b'
          if (!prev.startsWith('b')) return prev;

          const newInput = prev + key;
          if (secretTimeoutRef.current) {
            clearTimeout(secretTimeoutRef.current);
          }
          secretTimeoutRef.current = setTimeout(() => {
            setSecretInput('');
          }, SECRET_CODE_TIMEOUT);

          return newInput.slice(-SECRET_CODE.length);
        });

        if (state.isComplete) return;

        // Shift + number: toggle number highlighting
        if (e.shiftKey) {
          setHighlightedNumber((prev) => (prev === num ? null : num));
          return;
        }

        if (state.selectedCell) {
          // Cell is selected, fill it
          dispatch({ type: 'SET_VALUE', value: num });
        } else {
          // No cell selected - toggle or switch highlight mode for this number
          setHighlightedNumber((prev) => (prev === num ? null : num));
        }
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        if (state.isComplete) return;
        dispatch({ type: 'CLEAR_CELL' });
      } else if (key === 'Escape') {
        dispatch({
          type: 'SELECT_CELL',
          cell: null as unknown as CellPosition,
        });
        setHighlightedNumber(null);
        setSecretInput('');
      } else if (
        state.selectedCell &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)
      ) {
        if (state.isComplete) return;
        e.preventDefault();
        const { row, col } = state.selectedCell;
        let newRow = row;
        let newCol = col;

        if (key === 'ArrowUp') newRow = Math.max(0, row - 1);
        if (key === 'ArrowDown') newRow = Math.min(8, row + 1);
        if (key === 'ArrowLeft') newCol = Math.max(0, col - 1);
        if (key === 'ArrowRight') newCol = Math.min(8, col + 1);

        dispatch({ type: 'SELECT_CELL', cell: { row: newRow, col: newCol } });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (secretTimeoutRef.current) {
        clearTimeout(secretTimeoutRef.current);
      }
    };
  }, [state.selectedCell, state.isComplete, highlightedNumber]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // If clicking the same cell, deselect it
      if (state.selectedCell?.row === row && state.selectedCell?.col === col) {
        dispatch({
          type: 'SELECT_CELL',
          cell: null as unknown as CellPosition,
        });
        return;
      }

      // If a number is highlighted (held digit mode) and cell is editable, fill it without selecting
      if (
        highlightedNumber !== null &&
        state.initial[row][col] === 0 &&
        !state.isComplete
      ) {
        // Temporarily select to fill, then deselect to keep only number highlighting
        dispatch({ type: 'SELECT_CELL', cell: { row, col } });
        dispatch({ type: 'SET_VALUE', value: highlightedNumber });
        dispatch({
          type: 'SELECT_CELL',
          cell: null as unknown as CellPosition,
        });
      } else {
        dispatch({ type: 'SELECT_CELL', cell: { row, col } });
      }
    },
    [highlightedNumber, state.initial, state.isComplete, state.selectedCell],
  );

  const handleNumberClick = useCallback(
    (num: number) => {
      // Track secret code input via clicks
      setSecretInput((prev) => {
        const newInput = prev + num.toString();
        if (secretTimeoutRef.current) {
          clearTimeout(secretTimeoutRef.current);
        }
        secretTimeoutRef.current = setTimeout(() => {
          setSecretInput('');
        }, 3000);

        if (newInput === SECRET_CODE) {
          dispatch({ type: 'AUTO_SOLVE' });
          return '';
        }
        return newInput.slice(-SECRET_CODE.length);
      });

      if (state.isComplete) return;

      if (state.selectedCell) {
        // Cell is selected, fill it
        dispatch({ type: 'SET_VALUE', value: num });
      } else {
        // No cell selected - toggle highlight mode for this number
        setHighlightedNumber((prev) => (prev === num ? null : num));
      }
    },
    [state.selectedCell, state.isComplete],
  );

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR_CELL' });
  }, []);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const handleNewGame = useCallback((difficulty: SudokuDifficulty) => {
    dispatch({ type: 'NEW_GAME', difficulty });
    setHighlightedNumber(null);
    setSecretInput('');
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setHighlightedNumber(null);
    setSecretInput('');
  }, []);

  // Memoize best time for current difficulty
  const bestTime = useMemo(() => {
    const scores = getHighScores().filter(
      (s) => s.difficulty === state.difficulty,
    );
    return scores.length > 0 ? scores[0] : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.difficulty, state.isComplete]);

  const isNewBestTime =
    state.isComplete && isNewBest(state.difficulty, state.elapsedTime);

  // Calculate highlighted cells (same row, column, box, or matching number)
  const getHighlightInfo = useCallback(
    (row: number, col: number) => {
      const cellValue = state.grid[row][col];

      // Long-press number highlighting mode - only highlight matching numbers, no row/col/box
      const isNumberSelected =
        highlightedNumber !== null && cellValue === highlightedNumber;

      // If in held digit mode (highlightedNumber is set), don't show row/col/box highlights
      if (highlightedNumber !== null) {
        return {
          isHighlighted: false,
          isSameNumber: false,
          isNumberSelected,
        };
      }

      if (!state.selectedCell) {
        return {
          isHighlighted: false,
          isSameNumber: false,
          isNumberSelected: false,
        };
      }

      const { row: selRow, col: selCol } = state.selectedCell;
      const selectedValue = state.grid[selRow][selCol];

      const sameRow = row === selRow;
      const sameCol = col === selCol;
      const sameBox =
        Math.floor(row / 3) === Math.floor(selRow / 3) &&
        Math.floor(col / 3) === Math.floor(selCol / 3);

      return {
        isHighlighted: sameRow || sameCol || sameBox,
        isSameNumber:
          cellValue !== 0 &&
          cellValue === selectedValue &&
          !(row === selRow && col === selCol),
        isNumberSelected: false,
      };
    },
    [state.selectedCell, state.grid, highlightedNumber],
  );

  // Render 3x3 boxes for better visual structure
  const renderGrid = useMemo(() => {
    const boxes = [];
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const cells = [];
        for (let cellRow = 0; cellRow < 3; cellRow++) {
          for (let cellCol = 0; cellCol < 3; cellCol++) {
            const row = boxRow * 3 + cellRow;
            const col = boxCol * 3 + cellCol;
            const value = state.grid[row][col];
            const isSelected =
              state.selectedCell?.row === row &&
              state.selectedCell?.col === col;
            const isInitial = state.initial[row][col] !== 0;
            const isError = state.errors.has(`${row}-${col}`);
            const { isHighlighted, isSameNumber, isNumberSelected } =
              getHighlightInfo(row, col);

            cells.push(
              <SudokuCell
                key={`${row}-${col}`}
                value={value}
                row={row}
                col={col}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isInitial={isInitial}
                isError={isError}
                isSameNumber={isSameNumber}
                isNumberSelected={isNumberSelected}
                onClick={handleCellClick}
              />,
            );
          }
        }
        boxes.push(<Box key={`box-${boxRow}-${boxCol}`}>{cells}</Box>);
      }
    }
    return boxes;
  }, [
    state.grid,
    state.initial,
    state.errors,
    state.selectedCell,
    getHighlightInfo,
    handleCellClick,
  ]);

  // Count remaining numbers for each digit
  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let n = 1; n <= 9; n++) {
      let count = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (state.grid[r][c] === n) count++;
        }
      }
      counts[n] = 9 - count; // remaining
    }
    return counts;
  }, [state.grid]);

  return (
    <GameContainer ref={containerRef}>
      <BoardSection>
        <StatusBar>
          <Timer
            startTime={state.startTime}
            isComplete={state.isComplete}
          />
          <ErrorBadge
            $hasErrors={state.errors.size > 0}
            role="status"
            aria-live="polite"
          >
            {state.errors.size > 0
              ? `${state.errors.size} error${state.errors.size > 1 ? 's' : ''}`
              : '✓ No errors'}
          </ErrorBadge>
        </StatusBar>

        <GridWrapper>
          <Grid
            role="grid"
            aria-label="Sudoku puzzle grid"
          >
            {renderGrid}
          </Grid>

          <WinOverlay
            isComplete={state.isComplete}
            elapsedTime={state.elapsedTime}
            isNewBestTime={isNewBestTime}
            difficulty={state.difficulty}
            onPlayAgain={handleNewGame}
          />
        </GridWrapper>

        <ScreenReaderOnly
          ref={announcementRef}
          aria-live="polite"
          aria-atomic="true"
        />
      </BoardSection>

      <ControlsSection>
        <Section>
          <SectionLabel id="difficulty-label">Difficulty</SectionLabel>
          <DifficultyTabs
            role="tablist"
            aria-labelledby="difficulty-label"
          >
            {(
              [
                'beginner',
                'easy',
                'medium',
                'hard',
                'expert',
              ] as SudokuDifficulty[]
            ).map((diff) => (
              <DifficultyTab
                key={diff}
                role="tab"
                $isActive={state.difficulty === diff}
                aria-selected={state.difficulty === diff}
                onClick={() => handleNewGame(diff)}
                data-active={state.difficulty === diff}
              >
                {diff === 'beginner' ? '👶' : diff === 'expert' ? '🔥' : ''}{' '}
                {diff}
              </DifficultyTab>
            ))}
          </DifficultyTabs>
        </Section>

        <Section>
          <SectionLabel id="numbers-label">
            Numbers {highlightedNumber && `(${highlightedNumber} highlighted)`}
          </SectionLabel>
          <NumberPad
            role="group"
            aria-labelledby="numbers-label"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <NumberButton
                key={num}
                $isActive={highlightedNumber === num}
                onClick={() => handleNumberClick(num)}
                disabled={state.isComplete || numberCounts[num] === 0}
                aria-label={`Number ${num}${numberCounts[num] === 0 ? ', completed' : ''}`}
                aria-pressed={highlightedNumber === num}
              >
                {num}
              </NumberButton>
            ))}
          </NumberPad>
        </Section>

        <ActionRow>
          <ActionButton
            onClick={handleUndo}
            disabled={state.history.length === 0 || state.isComplete}
            aria-label="Undo last action (Ctrl+Z)"
          >
            <Undo2
              size={16}
              aria-hidden="true"
            />
            Undo
          </ActionButton>
          <ActionButton
            onClick={handleClear}
            disabled={!state.selectedCell || state.isComplete}
            aria-label="Erase selected cell"
          >
            <Eraser
              size={16}
              aria-hidden="true"
            />
            Erase
          </ActionButton>
          <ActionButton
            onClick={handleReset}
            aria-label="Reset puzzle to initial state"
          >
            <RotateCcw
              size={16}
              aria-hidden="true"
            />
            Reset
          </ActionButton>
        </ActionRow>

        <ActionButton
          $variant="primary"
          onClick={() => handleNewGame(state.difficulty)}
          aria-label={`Start new ${state.difficulty} game`}
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
          />
          New Game
        </ActionButton>

        {bestTime && (
          <Section>
            <SectionLabel>Best Time</SectionLabel>
            <HighScoreItem
              $rank={1}
              role="status"
            >
              <span>🏆</span>
              <span>{formatTime(bestTime.time)}</span>
            </HighScoreItem>
          </Section>
        )}
      </ControlsSection>
    </GameContainer>
  );
});

Sudoku.displayName = 'Sudoku';

export default Sudoku;
