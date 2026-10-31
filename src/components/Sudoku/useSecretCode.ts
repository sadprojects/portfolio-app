import { useEffect, useRef } from 'react';

import { SECRET_CODE, SECRET_CODE_TIMEOUT_MS } from './constants';

export const useSecretCode = (onEntered: () => void) => {
  const typedSoFar = useRef('');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const reset = () => {
    typedSoFar.current = '';
  };

  const track = (char: string) => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(reset, SECRET_CODE_TIMEOUT_MS);
    typedSoFar.current = (typedSoFar.current + char).slice(-SECRET_CODE.length);
    if (typedSoFar.current === SECRET_CODE) {
      reset();
      onEntered();
    }
  };

  return { track, reset };
};
