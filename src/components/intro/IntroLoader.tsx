import { useIntro } from '@contexts/IntroContext';
import { contentData } from '@data/content';
import { EASE } from '@styles/grid';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useDecodedText } from './useDecodedText';
import { useGlyphRain } from './useGlyphRain';

const MIN_VISIBLE_MS = 3200;
const NAME_DELAY_MS = 200;
const NAME_STEP_MS = 70;
const ROLE_DELAY_MS = 600;
const ROLE_STEP_MS = 28;
const PROGRESS_EASE = [0.3, 0.05, 0.2, 1] as const;
const LIFT_SECONDS = 0.9;

const Curtain = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
`;

const RainCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const Centre = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  text-align: center;
`;

const Name = styled.div`
  min-height: 1em;
  font-family: ${({ theme }) => theme.typography.fonts.hand};
  font-weight: 600;
  font-size: clamp(2.6rem, 6vw, 4.5rem);
  line-height: 1;
`;

const Role = styled.div`
  min-height: 1.2em;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.1rem, 1.8vw, 1.6rem);
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Meter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: min(22rem, 70vw);
  margin-top: 1.5rem;
`;

const MeterTrack = styled.div`
  height: 1px;
  background: ${({ theme }) => `${theme.colors.foreground}33`};
`;

const MeterFill = styled(motion.div)`
  height: 1px;
  background: currentColor;
  transform-origin: 0 50%;
`;

const MeterReadout = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.secondary};
`;

const IntroCurtain = () => {
  const { contact } = contentData;
  const rainRef = useRef<HTMLCanvasElement>(null);
  const name = useDecodedText(contact.name, NAME_DELAY_MS, NAME_STEP_MS);
  const role = useDecodedText(
    `${contact.position} · ${contact.location}`,
    ROLE_DELAY_MS,
    ROLE_STEP_MS,
  );
  useGlyphRain(rainRef);

  const progress = useMotionValue(0);
  const percent = useTransform(progress, (value) => `${Math.round(value)}%`);
  const fill = useTransform(progress, (value) => value / 100);
  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: MIN_VISIBLE_MS / 1000,
      ease: PROGRESS_EASE,
    });
    return () => controls.stop();
  }, [progress]);

  return (
    <Curtain
      aria-hidden="true"
      data-testid="intro-loader"
      exit={{ y: '-100%' }}
      transition={{ duration: LIFT_SECONDS, ease: EASE }}
    >
      <RainCanvas ref={rainRef} />
      <Centre exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4 }}>
        <Name>{name}</Name>
        <Role>{role}</Role>
        <Meter>
          <MeterTrack>
            <MeterFill style={{ scaleX: fill }} />
          </MeterTrack>
          <MeterReadout>
            <span>Loading</span>
            <motion.span>{percent}</motion.span>
          </MeterReadout>
        </Meter>
      </Centre>
    </Curtain>
  );
};

export const IntroLoader = () => {
  const { done, finish } = useIntro();

  useEffect(() => {
    if (done) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    let cancelled = false;
    const lift = async () => {
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, MIN_VISIBLE_MS)),
        document.fonts?.ready,
      ]);
      if (!cancelled) finish();
    };
    lift();
    return () => {
      cancelled = true;
      html.style.overflow = previousOverflow;
    };
  }, [done, finish]);

  return <AnimatePresence>{!done && <IntroCurtain />}</AnimatePresence>;
};
