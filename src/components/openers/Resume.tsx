import { Statement } from '@components/motion/Statement';
import { contentData } from '@data/content';
import type { SectionIntro } from '@data/types';
import {
  motion,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import styled from 'styled-components';

import { Cutout, Scrollbar, Startup, type Rect } from './Cutout';
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

/* A CV's shape in faint bars, in % of the page: [left, top, widths of the lines]. The middle band stays clear for the section's line. */
const SKELETON_GROUPS: [number, number, number[]][] = [
  [8, 10, [24, 14]],
  [8, 22, [28, 28, 22]],
  [44, 22, [32, 32, 26, 30]],
  [8, 70, [28, 28, 20]],
  [44, 70, [46, 42, 46, 34]],
  [44, 86, [38, 44]],
];
const LINE_PITCH = 2.6;

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

/* A sheet of the document: opaque in the page's tone, so what it shows can be read and selected; on its own layer, since the first one scrolls. */
const Sheet = styled(Startup)`
  pointer-events: auto;
  will-change: transform;
`;

const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Portrait = styled.img`
  position: absolute;
  top: 8%;
  right: 8%;
  width: 11%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 3px;
  opacity: 0.85;
`;

const Bar = styled.i<{ $left: number; $top: number; $width: number }>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  top: ${({ $top }) => $top}%;
  width: ${({ $width }) => $width}%;
  height: 1.1%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  opacity: 0.7;
`;

const FirstPage = styled(motion.div)`
  position: relative;
  width: 100%;
`;

/* What makes a sheet read as the CV: the portrait in a corner and the faint lines of a résumé. */
const ResumeSheet = () => (
  <Skeleton aria-hidden="true">
    <Portrait
      src={`/media/images/${contentData.contact.profileImage}`}
      alt=""
    />
    {SKELETON_GROUPS.flatMap(([left, top, widths]) =>
      widths.map((width, line) => (
        <Bar
          key={`${left}-${top}-${line}`}
          $left={left}
          $top={top + line * LINE_PITCH}
          $width={width}
        />
      )),
    )}
  </Skeleton>
);

/* The sheet the lid closes on: there only while it covers, since even transparent it would catch the clicks and selections meant for the section behind it. */
const ClosingSheet = ({ opacity }: { opacity: MotionValue<number> }) => {
  const visibility = useTransform(opacity, (covering) =>
    covering > 0 ? 'visible' : 'hidden',
  );
  return (
    <Sheet style={{ opacity, visibility }}>
      <ResumeSheet />
    </Sheet>
  );
};

interface ResumeFrameProps {
  intro: SectionIntro;
  /** Opacity of the first page, for an opener that fades it away. */
  firstPageOpacity?: MotionValue<number>;
  /** How far the first page has scrolled up, in px, with the section following right behind it. */
  firstPageY?: MotionValue<number>;
  /** Zoom of the line as the document opens; settled when absent. */
  firstPageScale?: MotionValue<number>;
  /** Opacity of the sheet that covers the page while the laptop closes, so the lid folds with the CV still on. */
  closingOpacity?: MotionValue<number>;
  /** How far through the document the reader is, for the scrollbar. */
  scrolled?: MotionValue<number>;
  className?: string;
  style?: MotionStyle;
}

/** The CV as a viewer window: a title bar with the file name over a page that shows what is behind it. */
export const ResumeFrame = ({
  intro,
  firstPageOpacity,
  firstPageY,
  firstPageScale,
  closingOpacity,
  scrolled,
  className,
  style,
}: ResumeFrameProps) => (
  <Viewer className={className} style={style}>
    <Cutout $rect={PAGE} $tone="card">
      <Sheet style={{ opacity: firstPageOpacity, y: firstPageY }}>
        <ResumeSheet />
        <FirstPage style={{ scale: firstPageScale }}>
          <Statement {...intro} exitOnScroll={false} />
        </FirstPage>
      </Sheet>
      {closingOpacity && <ClosingSheet opacity={closingOpacity} />}
      {scrolled && <Scrollbar progress={scrolled} />}
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
