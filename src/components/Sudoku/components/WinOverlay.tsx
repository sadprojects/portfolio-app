import { AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

import { formatTime } from '../sudokuUtils';
import type { SudokuDifficulty } from '../types';
import {
  ActionButton,
  NewBestBadge,
  WinContent,
  WinOverlay as StyledWinOverlay,
  WinTime,
  WinTitle,
} from '../Sudoku.styles';

export interface WinOverlayProps {
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
          <Trophy
            size={56}
            color="currentColor"
          />
          <WinContent>
            <WinTitle>Puzzle Complete!</WinTitle>
            <WinTime>{formatTime(elapsedTime)}</WinTime>
            {isNewBestTime && <NewBestBadge>🏆 New Record!</NewBestBadge>}
          </WinContent>
          <ActionButton
            $variant="primary"
            onClick={() => onPlayAgain(difficulty)}
            style={{
              marginTop: '0.5rem',
              flex: 'none',
              width: 'auto',
              padding: '0.75rem 2rem',
            }}
          >
            Play Again
          </ActionButton>
        </StyledWinOverlay>
      )}
    </AnimatePresence>
  );
};

WinOverlay.displayName = 'WinOverlay';
