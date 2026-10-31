import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatTime } from '../scores';
import { TimerDisplay } from '../Sudoku.styles';

const TICK_MS = 1000;

export interface TimerProps {
  startTime: number;
  isComplete: boolean;
}

export const Timer = ({ startTime, isComplete }: TimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
  }, [startTime]);

  useEffect(() => {
    if (isComplete) return;
    const ticker = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, TICK_MS);
    return () => clearInterval(ticker);
  }, [startTime, isComplete]);

  return (
    <TimerDisplay>
      <Clock size={18} />
      {formatTime(elapsed)}
    </TimerDisplay>
  );
};
