import { EASE, Grid, col } from '@styles/grid';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
`;

const Mark = styled.div`
  ${col('2 / 5', '1 / 5')}
  font-family: ${({ theme }) => theme.typography.fonts.hand};
  font-weight: 600;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1;
`;

const Track = styled.div`
  ${col('5 / 11', '5 / 13')}
  position: relative;
  padding-top: 1.25rem;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.25rem, 1.9vw, 2.3rem);
`;

const Line = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
  transform-origin: 0 50%;
`;

const Words = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.3em;
`;

const seen = () => {
  try {
    return sessionStorage.getItem('intro-seen') === '1';
  } catch {
    return true;
  }
};

const WORDS = ['Lead', 'software', 'engineer.', 'Bucharest.'];

/** One-time curtain shown on first load per session, then lifted off the page. */
export const IntroLoader = () => {
  const [show, setShow] = useState(
    () =>
      typeof window !== 'undefined' &&
      !seen() &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem('intro-seen', '1');
    } catch {
      /* private mode */
    }
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const timer = setTimeout(() => setShow(false), 1700);
    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = previous;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <Overlay
          aria-hidden="true"
          data-testid="intro-loader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Grid>
            <Mark>Silviu Dinu</Mark>
            <Track>
              <Line
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.3, ease: 'linear' }}
              />
              <Words>
                {WORDS.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.18 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </Words>
            </Track>
          </Grid>
        </Overlay>
      )}
    </AnimatePresence>
  );
};
