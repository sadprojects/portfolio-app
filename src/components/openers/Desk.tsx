import { Statement } from '@components/motion/Statement';
import { contentData } from '@data/content';
import type { SectionId, SectionIntro } from '@data/types';
import { OPENER_FADE_IN, OPENER_SPRING } from '@styles/motion';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FileText, Folder, Globe, Settings, Terminal } from 'lucide-react';
import {
  useRef,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from 'react';
import styled from 'styled-components';

import { LaptopFrame, ScreenInset, ScreenStartup } from './Laptop';
import { ARTWORK, PINNED_WIDTH, SCREEN, SCREEN_CENTRE } from './laptopArtwork';
import { ResumeFrame } from './Resume';

export interface DeskApp {
  id: SectionId;
  intro: SectionIntro;
  body: ReactNode;
}

/* Scroll runways in viewports: the laptop zooms in over the first (and 0.3 before it pins), the dock and the document take the next, and the laptop shrinks away over 0.6 of one. */
const ARRIVE_VH = 100;
const DESK_VH = 100;
const LEAVE_VH = 60;
const START_SCALE = 2.2;
const END_SCALE = 0.6;
const DOCUMENT_ICON_SCALE = 0.06;

/* Beats of the desk runway, as progress: the dock rises, the CV's icon is clicked and labelled, the document opens over the section on screen, its first page is read, then it clears. */
const DOCK_SHOWS = [0, 0.15, 0.7, 0.8];
const ICON_CLICK = [0.15, 0.22, 0.3];
const LABEL_SHOWS = [0.15, 0.22, 0.3, 0.36];
const DOCUMENT_OPENS = [0.3, 0.75];
const DOCUMENT_APPEARS = [0.3, 0.38];
const SCREEN_SECTION_FADES = [0.5, 0.75];
const FIRST_PAGE_FADES = [0.85, 1];

const viewportHeight = () => document.documentElement.clientHeight;

const laptopHeight = `calc(${PINNED_WIDTH} / ${ARTWORK.width / ARTWORK.height})`;

/* The laptop is pushed down until its screen's bottom edge meets the viewport's; the sections are as wide as the screen and shrink towards its centre. */
const geometry = {
  '--shift': `calc(100vh - calc((100vh - ${laptopHeight}) / 2 + ${laptopHeight} * ${(SCREEN.top + SCREEN.height) / 100}))`,
  '--screen-width': `calc(${PINNED_WIDTH} * ${SCREEN.width / 100})`,
  '--screen-centre': `calc(100vh - ${laptopHeight} * ${SCREEN.height / 200})`,
} as CSSProperties;

/* Once the laptop has left, its pin still slides out over one viewport; the next section waits underneath and is uncovered as it goes. A formatting root, so the leaving runway (the last section's bottom margin) counts towards the pin's travel. */
const Track = styled.section`
  position: relative;
  display: flow-root;
  margin-bottom: -100vh;
  scroll-margin-top: 4rem;
`;

/* Pinned for the whole runway, above the sections, so they show only through the laptop's screen. Centred on both axes even though the laptop outgrows the viewport. */
const Pin = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: grid;
  place-content: center;
  place-items: center;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
`;

const Artwork = styled(motion.div)`
  position: relative;
  top: var(--shift);
  will-change: transform;
`;

const Dock = styled(motion.div)`
  position: absolute;
  left: 50%;
  bottom: 2.5%;
  display: flex;
  gap: 0.45em;
  height: 9%;
  padding: 0.45em;
  translate: -50% 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1.2em;
  background: ${({ theme }) => `${theme.colors.card}cc`};
  backdrop-filter: blur(14px);
  font-size: clamp(0.4rem, 0.7vw, 0.7rem);
`;

const DockIcon = styled(motion.span)`
  position: relative;
  display: grid;
  place-items: center;
  height: 100%;
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24%;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};

  svg {
    width: 50%;
    height: 50%;
  }
`;

const DocumentIcon = styled(DockIcon)`
  grid-template-rows: 1fr auto;
  padding-bottom: 0.35em;

  svg {
    align-self: end;
  }

  small {
    font-size: 0.7em;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
`;

const DockLabel = styled(motion.span)`
  position: absolute;
  bottom: 125%;
  left: 50%;
  padding: 0.35em 0.7em;
  translate: -50% 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5em;
  background: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-weight: 400;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.secondary};
`;

/* Fills the screen once open; grows out of its dock icon. */
const Document = styled(ResumeFrame)`
  position: absolute;
  inset: 0;
  aspect-ratio: auto;
  transform-origin: 50% 95%;
  will-change: transform, opacity;
`;

/* Behind the pin and as wide as the screen; its first line enters at the screen's bottom edge once the laptop has settled. */
const SectionOnScreen = styled(motion.div)`
  position: relative;
  isolation: isolate;
  width: var(--screen-width);
  margin: 0 auto;
  padding-top: ${ARRIVE_VH}vh;
  will-change: transform, opacity;
`;

/* Fades in as the document's first page clears, above whatever section waits below the laptop; holds still and shrinks with the laptop as it leaves. */
const SectionInDocument = styled(SectionOnScreen)`
  z-index: 1;
  padding-top: ${DESK_VH}vh;
  margin-bottom: ${LEAVE_VH}vh;
  background: ${({ theme }) => theme.colors.card};
  transform-origin: 50% calc(100% - 100vh + var(--screen-centre));
`;

/* A keyboard user tabbing to something hidden behind the laptop gets it scrolled onto the screen. */
const keepFocusOnScreen = (event: FocusEvent<HTMLElement>) => {
  if (event.target.matches(':focus-visible')) {
    event.target.scrollIntoView({ block: 'center' });
  }
};

interface DeskProps {
  /** Shown on the laptop's screen as it arrives. */
  onScreen: DeskApp;
  /** Opened from the dock as the CV once the first has scrolled through. */
  inDock: DeskApp;
}

/** A pinned laptop that hosts two sections: the first scrolls on its screen, then its dock rises, the CV's icon is clicked and the document opens to scroll the second; finally the laptop shrinks away with the document still open. */
export const Desk = ({ onScreen, inDock }: DeskProps) => {
  const track = useRef<HTMLElement>(null);
  const screenSection = useRef<HTMLDivElement>(null);
  const { scrollYProgress: arrival } = useScroll({
    target: track,
    offset: ['start 70%', `start ${-ARRIVE_VH}%`],
  });
  // The stretch over which the section on screen, holding still, would otherwise scroll out of view.
  const { scrollYProgress: deskRunway } = useScroll({
    target: screenSection,
    offset: ['end end', 'end start'],
  });
  const { scrollYProgress: departure } = useScroll({
    target: track,
    offset: [`end ${100 + LEAVE_VH}%`, 'end end'],
  });
  const arrive = useSpring(arrival, OPENER_SPRING);
  const desk = useSpring(deskRunway, OPENER_SPRING);
  const leave = useSpring(departure, OPENER_SPRING);

  const zoomIn = useTransform(arrive, [0, 1], [START_SCALE, 1]);
  const zoomOut = useTransform(leave, [0, 1], [1, END_SCALE]);
  const laptopScale = useTransform(
    [zoomIn, zoomOut],
    ([entering, leaving]: number[]) => entering * leaving,
  );
  const lineOpacity = useTransform(
    arrive,
    [...OPENER_FADE_IN, 0.85, 1],
    [0, 1, 1, 0],
  );

  const dockY = useTransform(desk, DOCK_SHOWS.slice(0, 2), ['140%', '0%']);
  const dockOpacity = useTransform(desk, DOCK_SHOWS, [0, 1, 1, 0]);
  const iconScale = useTransform(desk, ICON_CLICK, [1, 1.3, 1]);
  const labelOpacity = useTransform(desk, LABEL_SHOWS, [0, 1, 1, 0]);
  const documentScale = useTransform(desk, DOCUMENT_OPENS, [
    DOCUMENT_ICON_SCALE,
    1,
  ]);
  const documentOpacity = useTransform(desk, DOCUMENT_APPEARS, [0, 1]);
  const firstPageOpacity = useTransform(desk, FIRST_PAGE_FADES, [1, 0]);

  // The section on screen holds its last screen while the document opens over it, then goes.
  const screenSectionOpacity = useTransform(desk, SCREEN_SECTION_FADES, [1, 0]);
  const screenSectionHold = useTransform(
    [deskRunway, screenSectionOpacity],
    ([progress, visible]: number[]) =>
      visible > 0 ? (progress * DESK_VH * viewportHeight()) / 100 : 0,
  );
  const screenSectionVisibility = useTransform(
    screenSectionOpacity,
    (visible) => (visible > 0 ? 'visible' : 'hidden'),
  );
  // The section in the document fades in as the first page clears, then holds still and shrinks with the laptop as it leaves.
  const documentSectionOpacity = useTransform(desk, FIRST_PAGE_FADES, [0, 1]);
  const documentSectionVisibility = useTransform(
    documentSectionOpacity,
    (visible) => (visible > 0 ? 'visible' : 'hidden'),
  );
  const documentSectionHold = useTransform(
    departure,
    (progress) => (progress * LEAVE_VH * viewportHeight()) / 100,
  );

  return (
    <Track ref={track} style={geometry}>
      <Pin>
        <Artwork
          style={{
            scale: laptopScale,
            width: PINNED_WIDTH,
            transformOrigin: SCREEN_CENTRE,
          }}
        >
          <LaptopFrame>
            <ScreenStartup style={{ opacity: lineOpacity }}>
              <Statement {...onScreen.intro} exitOnScroll={false} />
            </ScreenStartup>
            <Dock style={{ y: dockY, opacity: dockOpacity }} aria-hidden="true">
              <DockIcon>
                <Folder />
              </DockIcon>
              <DockIcon>
                <Globe />
              </DockIcon>
              <DocumentIcon style={{ scale: iconScale }}>
                <FileText />
                <small>PDF</small>
                <DockLabel style={{ opacity: labelOpacity }}>
                  {contentData.contact.cv}
                </DockLabel>
              </DocumentIcon>
              <DockIcon>
                <Terminal />
              </DockIcon>
              <DockIcon>
                <Settings />
              </DockIcon>
            </Dock>
            <Document
              firstPageOpacity={firstPageOpacity}
              intro={inDock.intro}
              style={{ scale: documentScale, opacity: documentOpacity }}
            />
          </LaptopFrame>
        </Artwork>
      </Pin>
      <SectionOnScreen
        ref={screenSection}
        data-section={onScreen.id}
        style={{
          y: screenSectionHold,
          opacity: screenSectionOpacity,
          visibility: screenSectionVisibility,
        }}
        onFocus={keepFocusOnScreen}
      >
        <ScreenInset>{onScreen.body}</ScreenInset>
      </SectionOnScreen>
      <SectionInDocument
        data-section={inDock.id}
        style={{
          y: documentSectionHold,
          scale: zoomOut,
          opacity: documentSectionOpacity,
          visibility: documentSectionVisibility,
        }}
        onFocus={keepFocusOnScreen}
      >
        <ScreenInset>{inDock.body}</ScreenInset>
      </SectionInDocument>
    </Track>
  );
};
