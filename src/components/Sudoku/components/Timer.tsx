import { Clock } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import { formatTime } from '../sudokuUtils';
import { TimerDisplay } from '../Sudoku.styles';

export interface TimerProps {
  startTime: number;
  isComplete: boolean;
}

export const Timer = memo(({ startTime, isComplete }: TimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  // Reset elapsed when game restarts
  useEffect(() => {
    setElapsed(0);
  }, [startTime]);

  return (
    <TimerDisplay>
      <Clock size={18} />
      {formatTime(elapsed)}
    </TimerDisplay>
  );
});

Timer.displayName = 'Timer';
