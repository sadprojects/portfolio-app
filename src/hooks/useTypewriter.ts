import { animate, type AnimationPlaybackControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ERASE_BASE_SECONDS = 0.1;
const ERASE_SECONDS_PER_CHAR = 0.025;
const TYPE_BASE_SECONDS = 0.3;
const TYPE_SECONDS_PER_CHAR = 0.065;
const TYPE_EASE = [0.3, 0, 0.25, 1] as const;

export const useTypewriter = (text: string, enabled: boolean) => {
  const [typed, setTyped] = useState('');
  const onScreen = useRef('');

  useEffect(() => {
    if (!enabled) return;
    const show = (value: string) => {
      onScreen.current = value;
      setTyped(value);
    };
    const previous = onScreen.current;
    let typing: AnimationPlaybackControls | undefined;

    const erasing = animate(previous.length, 0, {
      duration: ERASE_BASE_SECONDS + previous.length * ERASE_SECONDS_PER_CHAR,
      ease: 'easeIn',
      onUpdate: (length) => show(previous.slice(0, Math.round(length))),
    });
    erasing.then(() => {
      typing = animate(0, text.length, {
        duration: TYPE_BASE_SECONDS + text.length * TYPE_SECONDS_PER_CHAR,
        ease: TYPE_EASE,
        onUpdate: (length) => show(text.slice(0, Math.round(length))),
      });
    });

    return () => {
      erasing.stop();
      typing?.stop();
    };
  }, [text, enabled]);

  return typed;
};
