import { useEffect, useRef, useState } from 'react';

const TOP_BAND_PX = 100;
const HOVER_LEAVE_DELAY_MS = 150;

export const useHeaderVisibility = (menuOpen: boolean) => {
  const [shownByScroll, setShownByScroll] = useState(true);
  const [hovered, setHovered] = useState(false);
  const lastScrollY = useRef(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (menuOpen) {
        setShownByScroll(true);
        return;
      }
      const { scrollY } = window;
      const scrollingUp = scrollY < lastScrollY.current;
      const nearTop = scrollY < TOP_BAND_PX;
      if (scrollingUp || nearTop) setShownByScroll(true);
      else if (scrollY > lastScrollY.current) setShownByScroll(false);
      lastScrollY.current = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    [],
  );

  const hoverIn = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovered(true);
  };
  const hoverOut = () => {
    leaveTimer.current = setTimeout(
      () => setHovered(false),
      HOVER_LEAVE_DELAY_MS,
    );
  };

  return {
    visible: shownByScroll || hovered,
    hidden: !shownByScroll,
    hoverIn,
    hoverOut,
    show: () => setShownByScroll(true),
  };
};
