import { RevealText } from '@components/motion/RevealText';
import { LineButton } from '@components/ui/LineButton';
import { useIntro } from '@contexts/IntroContext';
import { contentData } from '@data/content';
import { useGreeting } from '@hooks/useGreeting';
import { useTypewriter } from '@hooks/useTypewriter';
import { useWeather } from '@hooks/useWeather';
import { VisuallyHidden } from '@styles/a11y';
import { EASE, Grid, col } from '@styles/grid';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowDown, Download } from 'lucide-react';
import { useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

const COPY_LIFT_PX = -260;
const COPY_FADE_RANGE = [0.05, 0.55];
const ACTIONS_DELAY_SECONDS = 0.6;

const Hero = styled(Grid)`
  position: relative;
  min-height: calc(100vh - 4rem);
  min-height: calc(100svh - 4rem);
  align-items: center;
  row-gap: 2.5rem;
  padding-top: 3rem;
  padding-bottom: clamp(5rem, 8vw, 8rem);
`;

const HeroCopy = styled(motion.div)`
  ${col('2 / 10', '1 / 12')}
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  min-width: 0;
`;

const Greeting = styled.p`
  margin: 0;
  min-height: 1.2em;
  font-family: ${({ theme }) => theme.typography.fonts.hand};
  font-weight: 600;
  font-size: clamp(1.5rem, 2.2vw, 2.6rem);
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.secondary};
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const Cursor = styled.span<{ $idle: boolean }>`
  display: inline-block;
  width: 2.75rem;
  height: 0.1rem;
  margin-left: 0.12em;
  vertical-align: baseline;
  background: currentColor;
  ${({ $idle }) =>
    $idle &&
    css`
      animation: ${blink} 1s step-end infinite;
    `}

  @media (max-width: 768px) {
    width: 0.75rem;
  }
`;

const Headline = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2.4rem, 4.8vw, 5.8rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 2.5rem;
`;

const ring = keyframes`
  from { transform: scale(1); opacity: 0.6; }
  to { transform: scale(1.9); opacity: 0; }
`;

const ScrollCue = styled(motion.button)`
  position: absolute;
  left: calc(50% - 1.5rem);
  bottom: clamp(1.25rem, 3vw, 2.5rem);
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  background: none;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition:
    color 0.3s ease,
    border-color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    border: 1px solid currentColor;
    animation: ${ring} 2s ease-out infinite;
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.foreground};
    border-color: ${({ theme }) => theme.colors.foreground};
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

interface HeroSectionProps {
  onViewWork: () => void;
  onScrollDown: () => void;
}

export const HeroSection = ({ onViewWork, onScrollDown }: HeroSectionProps) => {
  const { homepage, contact } = contentData;
  const { done: introDone } = useIntro();
  const reduceMotion = useReducedMotion();
  const weather = useWeather();
  const greeting = useGreeting(introDone, weather);
  const typed = useTypewriter(greeting, introDone && !reduceMotion);
  const shownGreeting = reduceMotion ? greeting : typed;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, COPY_LIFT_PX]);
  const copyOpacity = useTransform(scrollYProgress, COPY_FADE_RANGE, [1, 0]);

  return (
    <Hero ref={heroRef}>
      <HeroCopy style={{ y: copyY, opacity: copyOpacity }}>
        <Greeting>
          <VisuallyHidden aria-live="polite">{greeting}</VisuallyHidden>
          <span aria-hidden="true">
            {shownGreeting}
            <Cursor $idle={shownGreeting === greeting} />
          </span>
        </Greeting>

        <Headline tag="h1" text={homepage.title} />

        <Actions
          initial={{ opacity: 0, y: 12 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: 0.8,
            delay: ACTIONS_DELAY_SECONDS,
            ease: EASE,
          }}
        >
          <LineButton onClick={onViewWork}>
            View My Work
            <ArrowDown size={14} />
          </LineButton>

          <LineButton as="a" href={`/media/cv/${contact.cv}`} download>
            <Download size={14} />
            Download CV
          </LineButton>
        </Actions>
      </HeroCopy>

      <ScrollCue
        type="button"
        aria-label="Scroll down"
        onClick={onScrollDown}
        style={{ opacity: copyOpacity }}
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown size={18} />
      </ScrollCue>
    </Hero>
  );
};
