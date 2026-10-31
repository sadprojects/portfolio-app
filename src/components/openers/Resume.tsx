import { Statement } from '@components/motion/Statement';
import { contentData } from '@data/content';
import type { SectionIntro } from '@data/types';
import { motion, type MotionStyle, type MotionValue } from 'framer-motion';
import styled from 'styled-components';

import { Cutout, Startup, type Rect } from './Cutout';
import { Zoom } from './Zoom';

/* A document viewer with the laptop screen's proportions: a slim title bar, then the page. */
const WINDOW_ASPECT = 1.5;
const TITLE_BAR_HEIGHT = 5;
const PAGE: Rect = {
  left: 0,
  top: TITLE_BAR_HEIGHT,
  width: 100,
  height: 100 - TITLE_BAR_HEIGHT,
};
const DOCK_SCALE = 0.06;
const OPENER_WIDTH = 'min(92vw, 64rem)';
const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840'];

const Viewer = styled(motion.div)`
  position: relative;
  aspect-ratio: ${WINDOW_ASPECT};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const TitleBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${TITLE_BAR_HEIGHT}%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: clamp(0.55rem, 0.85vw, 0.8rem);
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.secondary};
`;

const WindowControls = styled.span`
  position: absolute;
  left: 1.2%;
  top: 50%;
  display: flex;
  gap: 0.55em;
  translate: 0 -50%;

  span {
    width: 0.85em;
    height: 0.85em;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  }
`;

const FirstPage = styled(motion.div)`
  width: 100%;
`;

interface ResumeFrameProps {
  /** Opacity of the first page, which carries the section's line and fades to let the section through. */
  firstPageOpacity: MotionValue<number>;
  /** Zoom of that line as the document opens; settled when absent. */
  firstPageScale?: MotionValue<number>;
  intro: SectionIntro;
  className?: string;
  style?: MotionStyle;
}

/** The CV as a viewer window: a title bar with the file name over a page that shows what is behind it. */
export const ResumeFrame = ({
  firstPageOpacity,
  firstPageScale,
  intro,
  className,
  style,
}: ResumeFrameProps) => (
  <Viewer className={className} style={style}>
    <Cutout $rect={PAGE} $tone="card">
      <Startup style={{ opacity: firstPageOpacity }}>
        <FirstPage style={{ scale: firstPageScale }}>
          <Statement {...intro} exitOnScroll={false} />
        </FirstPage>
      </Startup>
    </Cutout>
    <TitleBar aria-hidden="true">
      <WindowControls>
        {TRAFFIC_LIGHTS.map((colour) => (
          <span key={colour} style={{ background: colour }} />
        ))}
      </WindowControls>
      {contentData.contact.cv}
    </TitleBar>
  </Viewer>
);

/** Opener alone: the viewer opens up to show its first page; the section follows below. */
export const Resume = ({ intro }: { intro: SectionIntro }) => (
  <Zoom start={DOCK_SCALE} origin="50% 100%" width={OPENER_WIDTH}>
    {(lineOpacity) => (
      <ResumeFrame firstPageOpacity={lineOpacity} intro={intro} />
    )}
  </Zoom>
);
