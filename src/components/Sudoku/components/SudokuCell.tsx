import { memo, useCallback } from 'react';

import { CellButton } from '../Sudoku.styles';

export interface SudokuCellProps {
  value: number;
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isInitial: boolean;
  isError: boolean;
  isSameNumber: boolean;
  isNumberSelected: boolean;
  onClick: (row: number, col: number) => void;
}

export const SudokuCell = memo(
  ({
    value,
    row,
    col,
    isSelected,
    isHighlighted,
    isInitial,
    isError,
    isSameNumber,
    isNumberSelected,
    onClick,
  }: SudokuCellProps) => {
    const handleClick = useCallback(() => {
      onClick(row, col);
    }, [onClick, row, col]);

    return (
      <CellButton
        $isSelected={isSelected}
        $isHighlighted={isHighlighted}
        $isNumberSelected={isNumberSelected}
        $isInitial={isInitial}
        $isError={isError}
        $isSameNumber={isSameNumber}
        onClick={handleClick}
        data-initial={isInitial}
        aria-label={`Row ${row + 1}, Column ${col + 1}, ${value || 'empty'}`}
        tabIndex={isSelected ? 0 : -1}
      >
        {value !== 0 ? value : ''}
      </CellButton>
    );
  },
);

SudokuCell.displayName = 'SudokuCell';
