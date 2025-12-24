import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
  max-width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2.5rem;
    align-items: flex-start;
  }
`;

export const BoardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`;

export const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-width: 0;
  width: 100%;

  @media (min-width: 768px) {
    min-width: 240px;
    width: auto;
  }
`;

export const TimerDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.foreground};

  svg {
    color: ${({ theme }) => theme.colors.secondary};
    flex-shrink: 0;
  }
`;

export const GridWrapper = styled.div`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 0 0 2px ${({ theme }) => theme.colors.foreground},
    0 8px 32px rgba(0, 0, 0, 0.12);
  
  @media (max-width: 767px) {
    max-width: 100%;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background: ${({ theme }) => theme.colors.foreground};
`;

export const Box = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const cellBase = css`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  border: none;
  padding: 0;
  transition:
    background-color 80ms ease,
    transform 80ms ease;
  user-select: none;
  position: relative;

  @media (max-width: 767px) {
    width: clamp(32px, 8.2vw, 42px);
    height: clamp(32px, 8.2vw, 42px);
  }

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.375rem;
  }
`;

export const CellButton = styled.button<{
  $isSelected: boolean;
  $isHighlighted: boolean;
  $isInitial: boolean;
  $isError: boolean;
  $isSameNumber: boolean;
  $isNumberSelected: boolean;
}>`
  ${cellBase}
  font-weight: ${({ $isInitial }) => ($isInitial ? '700' : '500')};
  cursor: pointer;

  background-color: ${({
    theme,
    $isSelected,
    $isHighlighted,
    $isError,
    $isSameNumber,
    $isNumberSelected,
  }) => {
    if ($isError) return 'rgba(239, 68, 68, 0.15)';
    if ($isSelected)
      return theme.colors.foreground === '#FFFFFF'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.1)';
    if ($isSameNumber || $isNumberSelected)
      return theme.colors.foreground === '#FFFFFF'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.06)';
    if ($isHighlighted)
      return theme.colors.foreground === '#FFFFFF'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.03)';
    return theme.colors.background;
  }};

  color: ${({ theme, $isInitial, $isError }) => {
    if ($isError) return '#dc2626';
    if ($isInitial) return theme.colors.foreground;
    return '#3b82f6';
  }};

  &:hover {
    background-color: ${({
      theme,
      $isError,
      $isSelected,
      $isSameNumber,
      $isNumberSelected,
    }) => {
      if ($isError) return 'rgba(239, 68, 68, 0.2)';
      if ($isSelected)
        return theme.colors.foreground === '#FFFFFF'
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.12)';
      if ($isSameNumber || $isNumberSelected)
        return theme.colors.foreground === '#FFFFFF'
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.08)';
      return theme.colors.foreground === '#FFFFFF'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)';
    }};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.foreground};
    z-index: 1;
  }
`;

export const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.375rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const NumberButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  font-size: clamp(1rem, 3vw, 1.25rem);
  font-weight: 700;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.foreground : 'transparent'};
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.625rem;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.background : theme.colors.foreground};
  cursor: pointer;
  transition: all 120ms ease;
  min-width: clamp(36px, 10vw, 44px);
  min-height: clamp(36px, 10vw, 44px);

  &:hover:not(:disabled) {
    background: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.foreground : theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? theme.colors.foreground
      : $variant === 'danger'
        ? 'rgba(239, 68, 68, 0.1)'
        : 'transparent'};
  border: 2px solid
    ${({ theme, $variant }) =>
      $variant === 'danger' ? '#ef4444' : theme.colors.foreground};
  border-radius: 0.625rem;
  color: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? theme.colors.background
      : $variant === 'danger'
        ? '#ef4444'
        : theme.colors.foreground};
  cursor: pointer;
  transition: all 120ms ease;
  min-height: 44px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const DifficultyTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.625rem;
  padding: 3px;
  gap: 2px;

  @media (max-width: 400px) {
    justify-content: center;
  }
`;

export const DifficultyTab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  min-width: fit-content;
  padding: 0.5rem 0.5rem;
  font-size: clamp(0.625rem, 2vw, 0.75rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.foreground : 'transparent'};
  border: none;
  border-radius: 0.375rem;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.background : theme.colors.secondary};
  cursor: pointer;
  transition: all 120ms ease;
  min-height: 36px;

  @media (min-width: 480px) {
    padding: 0.625rem 0.75rem;
    letter-spacing: 0.05em;
  }

  &:hover:not([data-active='true']) {
    color: ${({ theme }) => theme.colors.foreground};
    background: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const SectionLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.secondary};
  padding-left: 2px;
`;

export const HighScoreItem = styled.div<{ $rank: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
  background: ${({ $rank, theme }) =>
    $rank === 1 ? 'rgba(251, 191, 36, 0.12)' : theme.colors.accent};
  border-radius: 0.375rem;
  font-variant-numeric: tabular-nums;

  span:first-child {
    font-size: 1rem;
  }
`;

export const WinOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: ${({ theme }) =>
    theme.colors.foreground === '#FFFFFF'
      ? 'rgba(0, 0, 0, 0.92)'
      : 'rgba(255, 255, 255, 0.97)'};
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  z-index: 10;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const WinContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
`;

export const WinTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: inherit;
  margin: 0;
`;

export const WinTime = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: inherit;
  margin: 0;
  font-variant-numeric: tabular-nums;
`;

export const NewBestBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1.25rem;
  background: ${({ theme }) => theme.colors.foreground};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.background};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ErrorBadge = styled.div<{ $hasErrors: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1.5px solid
    ${({ $hasErrors, theme }) => ($hasErrors ? '#ef4444' : theme.colors.border)};
  border-radius: 2rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ $hasErrors, theme }) =>
    $hasErrors ? '#dc2626' : theme.colors.secondary};
  background: ${({ $hasErrors }) =>
    $hasErrors ? 'rgba(239, 68, 68, 0.08)' : 'transparent'};
`;

export const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
