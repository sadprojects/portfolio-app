import { useEffect, type Dispatch } from 'react';

import { GRID_SIZE } from './constants';
import type { GameAction } from './gameReducer';
import type { CellPosition } from './types';

const ARROW_STEPS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};
const CLEAR_KEYS = ['Backspace', 'Delete', '0'];

const isDigitKey = (key: string) => key >= '1' && key <= '9';

const clampToGrid = (index: number) =>
  Math.min(GRID_SIZE - 1, Math.max(0, index));

interface SudokuKeyboardOptions {
  selectedCell: CellPosition | null;
  isComplete: boolean;
  dispatch: Dispatch<GameAction>;
  toggleHighlight: (digit: number) => void;
  clearHighlight: () => void;
  secret: { track: (char: string) => void; reset: () => void };
}

export const useSudokuKeyboard = ({
  selectedCell,
  isComplete,
  dispatch,
  toggleHighlight,
  clearHighlight,
  secret,
}: SudokuKeyboardOptions) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if ((event.ctrlKey || event.metaKey) && key === 'z') {
        event.preventDefault();
        dispatch({ type: 'UNDO' });
        return;
      }

      if (key.toLowerCase() === 'b') {
        secret.track('b');
        return;
      }

      if (isDigitKey(key)) {
        secret.track(key);
        if (isComplete) return;
        const digit = Number(key);
        if (event.shiftKey || !selectedCell) toggleHighlight(digit);
        else dispatch({ type: 'SET_VALUE', value: digit });
        return;
      }

      if (CLEAR_KEYS.includes(key)) {
        if (!isComplete) dispatch({ type: 'CLEAR_CELL' });
        return;
      }

      if (key === 'Escape') {
        dispatch({ type: 'SELECT_CELL', cell: null });
        clearHighlight();
        secret.reset();
        return;
      }

      const step = ARROW_STEPS[key];
      if (step && selectedCell && !isComplete) {
        event.preventDefault();
        dispatch({
          type: 'SELECT_CELL',
          cell: {
            row: clampToGrid(selectedCell.row + step[0]),
            col: clampToGrid(selectedCell.col + step[1]),
          },
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    selectedCell,
    isComplete,
    dispatch,
    toggleHighlight,
    clearHighlight,
    secret,
  ]);
};
