import { SudokuCell } from './components/SudokuCell';
import { BOX_SIZE, GRID_SIZE } from './constants';
import { cellKey } from './puzzle';
import { BoardBox, BoardGrid } from './Sudoku.styles';
import type { SudokuGameState } from './types';

const sameBox = (a: number, b: number) =>
  Math.floor(a / BOX_SIZE) === Math.floor(b / BOX_SIZE);

const highlightFor = (
  state: SudokuGameState,
  heldDigit: number | null,
  row: number,
  col: number,
) => {
  const value = state.grid[row][col];
  if (heldDigit !== null) {
    return {
      isHighlighted: false,
      isSameNumber: false,
      isNumberSelected: value === heldDigit,
    };
  }
  if (!state.selectedCell) {
    return {
      isHighlighted: false,
      isSameNumber: false,
      isNumberSelected: false,
    };
  }
  const { row: selectedRow, col: selectedCol } = state.selectedCell;
  const isSelected = row === selectedRow && col === selectedCol;
  const selectedValue = state.grid[selectedRow][selectedCol];
  return {
    isHighlighted:
      row === selectedRow ||
      col === selectedCol ||
      (sameBox(row, selectedRow) && sameBox(col, selectedCol)),
    isSameNumber: value !== 0 && value === selectedValue && !isSelected,
    isNumberSelected: false,
  };
};

const boxCells = (box: number) =>
  Array.from({ length: GRID_SIZE }, (_, cell) => ({
    row: Math.floor(box / BOX_SIZE) * BOX_SIZE + Math.floor(cell / BOX_SIZE),
    col: (box % BOX_SIZE) * BOX_SIZE + (cell % BOX_SIZE),
  }));

interface BoardProps {
  state: SudokuGameState;
  heldDigit: number | null;
  onCellClick: (row: number, col: number) => void;
}

export const Board = ({ state, heldDigit, onCellClick }: BoardProps) => (
  <BoardGrid role="group" aria-label="Sudoku puzzle grid">
    {Array.from({ length: GRID_SIZE }, (_, box) => (
      <BoardBox key={box}>
        {boxCells(box).map(({ row, col }) => (
          <SudokuCell
            key={cellKey(row, col)}
            value={state.grid[row][col]}
            row={row}
            col={col}
            isSelected={
              state.selectedCell?.row === row && state.selectedCell?.col === col
            }
            isInitial={state.initial[row][col] !== 0}
            isError={state.errors.has(cellKey(row, col))}
            {...highlightFor(state, heldDigit, row, col)}
            onClick={onCellClick}
          />
        ))}
      </BoardBox>
    ))}
  </BoardGrid>
);
