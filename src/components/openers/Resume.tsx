import type { SectionIntro } from '@data/types';
import type { MotionValue } from 'framer-motion';
import styled from 'styled-components';

import {
  Cutout,
  ScrollFrame,
  Startup,
  type Rect,
  type WindowProps,
} from './ScrollFrame';
import { Zoom } from './Zoom';

/* A portrait sheet whose margins, in % of its width, frame the section. */
const SHEET_ASPECT = 0.8;
const MARGIN = 7;
const PAGE: Rect = {
  left: MARGIN,
  top: MARGIN * SHEET_ASPECT,
  width: 100 - 2 * MARGIN,
  height: 100 - 2 * MARGIN * SHEET_ASPECT,
};
const START_SCALE = 2.6;
const OPENER_WIDTH = 'min(92vw, 70vh)';
/* Pinned, the page runs nearly edge to edge, clear of the section dots on the right, and taller than the viewport. */
const PINNED_WIDTH = '88vw';

const Sheet = styled.div`
  position: relative;
  aspect-ratio: ${SHEET_ASPECT};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  box-shadow:
    ${({ theme }) => theme.shadows.xl},
    0 0 0 200vmax ${({ theme }) => theme.colors.background};
`;

/* Narrow enough to stay inside the viewport while the sheet arrives at full zoom. */
const Highlight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
  max-width: 34rem;
  padding: 0 6%;
`;

const HighlightLabel = styled.p`
  margin: 0;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const HighlightText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.2rem, 1.7vw, 1.7rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

interface ResumeFrameProps {
  startupOpacity: MotionValue<number>;
  intro: SectionIntro;
}

const ResumeFrame = ({ startupOpacity, intro }: ResumeFrameProps) => (
  <Sheet>
    <Cutout $rect={PAGE} $tone="card">
      <Startup style={{ opacity: startupOpacity }}>
        <Highlight>
          <HighlightLabel>{intro.label}</HighlightLabel>
          <HighlightText>{intro.text}</HighlightText>
        </Highlight>
      </Startup>
    </Cutout>
  </Sheet>
);

/** Opener alone: the sheet zooms out to show its highlight; the section follows below. */
export const Resume = ({ intro }: { intro: SectionIntro }) => (
  <Zoom start={START_SCALE} width={OPENER_WIDTH}>
    {(startupOpacity) => (
      <ResumeFrame startupOpacity={startupOpacity} intro={intro} />
    )}
  </Zoom>
);

/** The sheet stays pinned while the section scrolls down its page, then shrinks away. */
export const ResumeWindow = ({ id, intro, children }: WindowProps) => (
  <ScrollFrame
    id={id}
    width={PINNED_WIDTH}
    aspect={SHEET_ASPECT}
    cutout={PAGE}
    tone="card"
    start={START_SCALE}
    artwork={(startupOpacity) => (
      <ResumeFrame startupOpacity={startupOpacity} intro={intro} />
    )}
  >
    {children}
  </ScrollFrame>
);
