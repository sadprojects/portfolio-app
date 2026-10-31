import { useRef } from 'react';

const DOUBLE_CLICK_WINDOW_MS = 400;

export const useDoubleClick = (onDoubleClick: () => void) => {
  const clicks = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return () => {
    clicks.current += 1;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    if (clicks.current === 2) {
      clicks.current = 0;
      onDoubleClick();
      return;
    }
    resetTimer.current = setTimeout(() => {
      clicks.current = 0;
    }, DOUBLE_CLICK_WINDOW_MS);
  };
};
