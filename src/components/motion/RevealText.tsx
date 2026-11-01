import { VisuallyHidden } from '@styles/a11y';
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { createElement, Fragment, useRef } from 'react';
import styled from 'styled-components';

import { useScrollReveal } from './useScrollReveal';

const WORD_STAGGER = 0.45;
const WORD_RISE_SPAN = 0.55;
const EXIT_LIFT_PX = -90;
const EXIT_FADE_END = 0.8;

const WordMask = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding: 0 0.05em 0.14em 0;
  margin-bottom: -0.14em;
`;

const RisingWord = styled(motion.span)`
  display: inline-block;
  will-change: transform;
`;

interface WordProps {
  text: string;
  enter: MotionValue<number>;
  start: number;
  end: number;
}

const Word = ({ text, enter, start, end }: WordProps) => {
  const y = useTransform(enter, [start, end], ['120%', '0%']);
  const opacity = useTransform(enter, [start, (start + end) / 2], [0, 1]);
  return <RisingWord style={{ y, opacity }}>{text}</RisingWord>;
};

interface RevealTextProps {
  text: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  exitOnScroll?: boolean;
  animate?: boolean;
  className?: string;
}

export const RevealText = ({
  text,
  tag = 'p',
  exitOnScroll = true,
  animate = true,
  className,
}: RevealTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { enter, exit } = useScrollReveal(ref);
  const exitY = useTransform(exit, [0, 1], [0, EXIT_LIFT_PX]);
  const exitOpacity = useTransform(exit, [0, EXIT_FADE_END], [1, 0]);
  const words = text.split(' ');

  if (reduceMotion || !animate) {
    return createElement(
      tag as 'p',
      { ref: ref as React.RefObject<HTMLParagraphElement>, className },
      text,
    );
  }

  return createElement(
    motion[tag] as typeof motion.p,
    {
      ref: ref as React.RefObject<HTMLParagraphElement>,
      className,
      style: exitOnScroll ? { y: exitY, opacity: exitOpacity } : undefined,
    },
    <VisuallyHidden key="text">{text}</VisuallyHidden>,
    words.map((word, index) => {
      const start = (index / words.length) * WORD_STAGGER;
      return (
        <Fragment key={`${word}-${index}`}>
          <WordMask aria-hidden="true">
            <Word
              text={word}
              enter={enter}
              start={start}
              end={start + WORD_RISE_SPAN}
            />
          </WordMask>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      );
    }),
  );
};
