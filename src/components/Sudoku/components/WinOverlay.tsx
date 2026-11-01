import { AnimatePresence } from 'framer-motion';

import { formatTime } from '../scores';
import {
  ActionButton,
  NewBestBadge,
  WinContent,
  WinOverlay as StyledWinOverlay,
  WinTime,
  WinTitle,
} from '../Sudoku.styles';
import type { SudokuDifficulty } from '../types';

interface WinOverlayProps {
  isComplete: boolean;
  elapsedTime: number;
  isNewBestTime: boolean;
  difficulty: SudokuDifficulty;
  onPlayAgain: (difficulty: SudokuDifficulty) => void;
}

export const WinOverlay = ({
  isComplete,
  elapsedTime,
  isNewBestTime,
  difficulty,
  onPlayAgain,
}: WinOverlayProps) => {
  return (
    <AnimatePresence>
      {isComplete && (
        <StyledWinOverlay
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <WinContent>
            <WinTitle>Solved.</WinTitle>
            <WinTime>{formatTime(elapsedTime)}</WinTime>
            {isNewBestTime && <NewBestBadge>New best</NewBestBadge>}
          </WinContent>
          <ActionButton onClick={() => onPlayAgain(difficulty)}>
            Play again
          </ActionButton>
        </StyledWinOverlay>
      )}
    </AnimatePresence>
  );
};
