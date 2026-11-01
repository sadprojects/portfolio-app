import { LineButton } from '@components/ui/LineButton';
import { srOnly } from '@styles/a11y';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

const ERROR_RED = '#ef4444';
const ERROR_RED_TEXT = '#dc2626';
const FOCUS_BLUE = '#2563eb';
const ENTRY_BLUE_DARK = '#60a5fa';
const ENTRY_BLUE_LIGHT = '#2563eb';

/* The small mono label the rest of the site uses for kickers. */
const kicker = css`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

/* One column, as wide as it is tall allows: the level and the clock above the board, the digits in a row beneath it, the actions last. */
export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: min(100%, 58vh);
  margin: 0 auto;
`;

export const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
`;

export const Readout = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
`;

export const StatusBar = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

export const TimerDisplay = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const ErrorBadge = styled.div<{ $hasErrors: boolean }>`
  ${kicker}
  color: ${({ $hasErrors, theme }) =>
    $hasErrors ? ERROR_RED_TEXT : theme.colors.secondary};
`;

/* As wide as its column; the cells take their size and their digits from it. */
export const BoardFrame = styled.div`
  position: relative;
  container-type: inline-size;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 4px;
`;

export const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background: ${({ theme }) => theme.colors.foreground};
`;

export const BoardBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

export const CellButton = styled.button<{
  $isSelected: boolean;
  $isHighlighted: boolean;
  $isInitial: boolean;
  $isError: boolean;
  $isSameNumber: boolean;
  $isNumberSelected: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border: none;
  font: inherit;
  font-size: 4.6cqw;
  font-weight: ${({ $isInitial }) => ($isInitial ? 600 : 400)};
  font-variant-numeric: tabular-nums;
  user-select: none;
  cursor: pointer;
  transition: background-color 80ms ease;

  background-color: ${({
    theme,
    $isSelected,
    $isHighlighted,
    $isError,
    $isSameNumber,
    $isNumberSelected,
  }) => {
    const isDark = theme.mode === 'dark';

    if ($isError)
      return isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)';
    if ($isSelected)
      return isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.1)';
    if ($isSameNumber || $isNumberSelected)
      return isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(0, 0, 0, 0.06)';
    if ($isHighlighted)
      return isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)';
    return theme.colors.background;
  }};

  color: ${({ theme, $isInitial, $isError }) => {
    const isDark = theme.mode === 'dark';

    if ($isError) return isDark ? ERROR_RED : ERROR_RED_TEXT;
    if ($isInitial) return theme.colors.foreground;
    return isDark ? ENTRY_BLUE_DARK : ENTRY_BLUE_LIGHT;
  }};

  &:hover {
    background-color: ${({
      theme,
      $isError,
      $isSelected,
      $isSameNumber,
      $isNumberSelected,
    }) => {
      const isDark = theme.mode === 'dark';

      if ($isError)
        return isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.2)';
      if ($isSelected)
        return isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(0, 0, 0, 0.12)';
      if ($isSameNumber || $isNumberSelected)
        return isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(0, 0, 0, 0.08)';
      return isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.04)';
    }};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.foreground};
    z-index: 1;
  }
`;

export const ControlLabel = styled.span<{ $hidden?: boolean }>`
  ${kicker}
  ${({ $hidden }) => $hidden && srOnly}
`;

export const DifficultyTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.4rem;
`;

/* Plain words; the chosen one is underlined, like the site's links. */
export const DifficultyTab = styled.button<{ $isActive: boolean }>`
  padding: 0 0 0.3rem;
  border: 0;
  border-bottom: 1px solid
    ${({ $isActive }) => ($isActive ? 'currentColor' : 'transparent')};
  background: none;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.foreground : theme.colors.secondary};
  cursor: pointer;
  transition:
    color 120ms ease,
    border-color 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${FOCUS_BLUE};
    outline-offset: 3px;
  }
`;

export const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.4rem;
`;

export const NumberButton = styled.button<{ $isActive?: boolean }>`
  aspect-ratio: 1;
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.foreground : theme.colors.border};
  border-radius: 4px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.foreground : 'transparent'};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.background : theme.colors.foreground};
  font: inherit;
  font-size: 1.1rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    color 120ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${FOCUS_BLUE};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem 1.75rem;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.75rem;
`;

/* The site's line button; a disabled one just waits. */
export const ActionButton = styled(LineButton)`
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const HighScoreItem = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const WinOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-content: center;
  gap: 1.5rem;
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background}f2;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const WinContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
`;

export const WinTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2rem, 9cqw, 3rem);
  line-height: 1;
`;

export const WinTime = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 1.25rem;
  font-variant-numeric: tabular-nums;
`;

export const NewBestBadge = styled.span`
  ${kicker}
  color: ${({ theme }) => theme.colors.foreground};
`;
