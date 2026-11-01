import { CellButton } from '../Sudoku.styles';

interface SudokuCellProps {
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

export const SudokuCell = ({
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
  return (
    <CellButton
      $isSelected={isSelected}
      $isHighlighted={isHighlighted}
      $isNumberSelected={isNumberSelected}
      $isInitial={isInitial}
      $isError={isError}
      $isSameNumber={isSameNumber}
      onClick={() => onClick(row, col)}
      data-initial={isInitial}
      aria-label={`Row ${row + 1}, Column ${col + 1}, ${value || 'empty'}`}
      tabIndex={isSelected ? 0 : -1}
    >
      {value !== 0 ? value : ''}
    </CellButton>
  );
};
