import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { createElement, Fragment, useRef } from 'react';
import styled from 'styled-components';
import { useScrollReveal } from './useScrollReveal';

const Mask = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding: 0 0.05em 0.14em 0;
  margin-bottom: -0.14em;
`;

const WordInner = styled(motion.span)`
  display: inline-block;
  will-change: transform;
`;

const Word = ({
  text,
  enter,
  start,
  end,
}: {
  text: string;
  enter: MotionValue<number>;
  start: number;
  end: number;
}) => {
  const y = useTransform(enter, [start, end], ['120%', '0%']);
  const opacity = useTransform(enter, [start, (start + end) / 2], [0, 1]);
  return <WordInner style={{ y, opacity }}>{text}</WordInner>;
};

interface RevealTextProps {
  text: string;
  /** Element to render; `as` is reserved by styled-components wrappers. */
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  /** Reserved for API compatibility; reveals are scroll-linked, not time-based. */
  delay?: number;
  /** Set false when a parent already scrubs the block out, so the text does not exit twice. */
  exitOnScroll?: boolean;
  className?: string;
}

/**
 * Words rise out of a mask as the sentence scrolls into view and sink back when it scrolls out,
 * both tied to scroll position so the motion reverses when the reader changes direction.
 */
export const RevealText = ({
  text,
  tag = 'p',
  exitOnScroll = true,
  className,
}: RevealTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { enter, exit } = useScrollReveal(ref);
  const exitY = useTransform(exit, [0, 1], [0, -90]);
  const exitOpacity = useTransform(exit, [0, 0.8], [1, 0]);
  const words = text.split(' ');

  if (reduceMotion) {
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
      'aria-label': text,
      style: exitOnScroll ? { y: exitY, opacity: exitOpacity } : undefined,
    },
    words.map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <Mask aria-hidden="true">
          <Word
            text={word}
            enter={enter}
            start={(i / words.length) * 0.45}
            end={(i / words.length) * 0.45 + 0.55}
          />
        </Mask>
        {i < words.length - 1 ? ' ' : null}
      </Fragment>
    )),
  );
};
