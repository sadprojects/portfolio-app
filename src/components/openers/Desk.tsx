import { Statement } from '@components/motion/Statement';
import { contentData } from '@data/content';
import type { SectionId, SectionIntro } from '@data/types';
import { OPENER_LINE, OPENER_SETTLES, OPENER_SPRING } from '@styles/motion';
import {
  easeInOut,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Compass,
  FileText,
  Folder,
  Image,
  Music,
  Settings,
  Terminal,
} from 'lucide-react';
import {
  useRef,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from 'react';
import styled, { useTheme } from 'styled-components';

import { Startup } from './Cutout';
import { LaptopFrame, ScreenInset } from './Laptop';
import { ARTWORK, PINNED_WIDTH, SCREEN, SCREEN_CENTRE } from './laptopArtwork';
import { ResumeFrame } from './Resume';

export interface DeskApp {
  id: SectionId;
  intro: SectionIntro;
  body: ReactNode;
}

/* Scroll runways in viewports: the laptop zooms in and its line is read over the first (and 0.7 before it pins); each section settles past its end, so nothing sits under the dock or the fold; the dock and the document take 2; the laptop shrinks away over 0.75, then closes its lid, recedes and rises out of the viewport over 1.5, and the camera follows from below. */
const ARRIVE_VH = 170;
const DESK_VH = 200;
const SETTLE_VH = 33;
const LEAVE_VH = 75;
const CLOSE_VH = 150;
const START_SCALE = 2.2;
const END_SCALE = 0.6;
const CLOSED_SCALE = 0.4;
const LID_CLOSED_DEGREES = -84;
const DOCUMENT_ICON_SCALE = 0.06;
const FIRST_PAGE_ZOOM = 1.8;

/* Beats of the desk runway, as progress: the dock rises, the CV's icon is clicked and labelled, the document grows out of it over the section on screen, its first page zooms into place and holds to be read, then it clears, and the page stays blank for a beat before the section follows. */
const DOCK_SHOWS = [0, 0.08, 0.72, 0.78];
const ICON_CLICK = [0.08, 0.12, 0.16];
const ICON_OPENS = [0.12, 0.16];
const LABEL_SHOWS = [0.08, 0.12, 0.26, 0.3];
const DOCUMENT_OPENS = [0.16, 0.62];
const DOCUMENT_APPEARS = [0.16, 0.22];
const SCREEN_SECTION_FADES = [0.4, 0.62];
const FIRST_PAGE_SETTLES = [0.16, 0.62];
const FIRST_PAGE_FADES = [0.8, 0.88];
/* Beats of the closing runway: the display goes dark and the backdrop sets in, the lid folds down onto the keyboard, and the laptop rises away before the fold is done. */
const SCREEN_GOES_DARK = [0, 0.15];
const LID_FOLDS = [0.15, 0.6];
const LAPTOP_RISES = [0.5, 1];
const RISEN_OUT = '-100vh';

/* The dock's apps, as tinted tiles; the CV sits in the middle, where the document grows from. */
const DOCK_APPS = [
  {
    name: 'files',
    Icon: Folder,
    tint: 'linear-gradient(160deg, #4cc2ff, #1a6cf0)',
    running: true,
  },
  {
    name: 'browser',
    Icon: Compass,
    tint: 'linear-gradient(160deg, #39b6ff, #1364d6)',
  },
  {
    name: 'photos',
    Icon: Image,
    tint: 'conic-gradient(from 200deg, #ff7a59, #ffd166, #7bd389, #4cc9f0, #c77dff, #ff7a59)',
  },
  {
    name: 'cv',
    Icon: FileText,
    tint: 'linear-gradient(160deg, #ff7b72, #d93a4a)',
  },
  {
    name: 'music',
    Icon: Music,
    tint: 'linear-gradient(160deg, #ff6b7a, #ff2d55)',
  },
  {
    name: 'terminal',
    Icon: Terminal,
    tint: 'linear-gradient(160deg, #3a3a3f, #141416)',
  },
  {
    name: 'settings',
    Icon: Settings,
    tint: 'linear-gradient(160deg, #a0a0a8, #5e5e66)',
  },
];
const DOCUMENT_APP = 'cv';

const viewportHeight = () => document.documentElement.clientHeight;

const laptopHeight = `calc(${PINNED_WIDTH} / ${ARTWORK.width / ARTWORK.height})`;

/* The laptop is pushed down until its screen's bottom edge meets the viewport's; the sections are as wide as the screen and shrink towards its centre. */
const geometry = {
  '--shift': `calc(100vh - calc((100vh - ${laptopHeight}) / 2 + ${laptopHeight} * ${(SCREEN.top + SCREEN.height) / 100}))`,
  '--screen-width': `calc(${PINNED_WIDTH} * ${SCREEN.width / 100})`,
  '--screen-centre': `calc(100vh - ${laptopHeight} * ${SCREEN.height / 200})`,
} as CSSProperties;

/* A formatting root, so the leaving runways (the last section's bottom margin) count towards the pin's travel. The pin lets go, in the page's own colour, once the laptop has risen out, and the next section follows from below. */
const Track = styled.section`
  position: relative;
  display: flow-root;
  scroll-margin-top: 4rem;
`;

/* Pinned for the whole runway, above the sections, so they show only through the laptop's screen. Centred on both axes even though the laptop outgrows the viewport. Takes a solid backdrop, the page's colour, while the lid closes. */
const Pin = styled(motion.div)`
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
  gap: 0.5em;
  height: 9.5%;
  padding: 0.5em;
  translate: -50% 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.3em;
  background: rgba(255, 255, 255, 0.22);
  box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px);
  font-size: clamp(0.4rem, 0.7vw, 0.7rem);
`;

const DockIcon = styled(motion.span)<{ $tint: string; $running?: boolean }>`
  position: relative;
  display: grid;
  place-items: center;
  height: 100%;
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24%;
  background: ${({ $tint }) => $tint};
  box-shadow: 0 0.15em 0.4em rgba(0, 0, 0, 0.35);
  color: #fff;

  svg {
    width: 52%;
    height: 52%;
    filter: drop-shadow(0 0.1em 0.2em rgba(0, 0, 0, 0.3));
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.65em;
    left: 50%;
    width: 0.35em;
    height: 0.35em;
    border-radius: 50%;
    translate: -50% 0;
    background: ${({ theme }) => theme.colors.foreground};
    opacity: ${({ $running }) => ($running ? 0.8 : 0)};
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

const RunningDot = styled(motion.i)`
  position: absolute;
  bottom: -0.65em;
  left: 50%;
  width: 0.35em;
  height: 0.35em;
  border-radius: 50%;
  translate: -50% 0;
  background: ${({ theme }) => theme.colors.foreground};
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
  transform-origin: 50% 93%;
  will-change: transform, opacity;
`;

/* Behind the pin and as wide as the screen; its first line enters at the screen's bottom edge once the laptop has settled and its line has cleared. */
const SectionOnScreen = styled(motion.div)`
  position: relative;
  isolation: isolate;
  width: var(--screen-width);
  margin: 0 auto;
  padding-top: ${ARRIVE_VH}vh;
  will-change: transform, opacity;
`;

/* Fades in as the document's first page clears, above whatever section waits below the laptop; settles a little past its end (its page still painted below it), then holds still and shrinks with the laptop as it leaves, and goes dark with the display. */
const SectionInDocument = styled(SectionOnScreen)`
  z-index: 1;
  padding: ${DESK_VH + SETTLE_VH}vh 0 ${SETTLE_VH}vh;
  margin-bottom: ${LEAVE_VH + CLOSE_VH}vh;
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

/** A pinned laptop that hosts two sections: the first scrolls on its screen, then its dock rises, the CV's icon is clicked and the document opens to scroll the second; finally the laptop shrinks away with the document still open, closes its lid as it recedes, and rises out of the viewport before the camera follows. */
export const Desk = ({ onScreen, inDock }: DeskProps) => {
  const track = useRef<HTMLElement>(null);
  const screenSection = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { scrollYProgress: arrival } = useScroll({
    target: track,
    offset: ['start 70%', `start ${-ARRIVE_VH}%`],
  });
  // Starts once the section on screen has settled; the stretch over which it, holding still, would otherwise scroll on.
  const { scrollYProgress: deskRunway } = useScroll({
    target: screenSection,
    offset: [`end ${100 - SETTLE_VH}%`, `end ${100 - SETTLE_VH - DESK_VH}%`],
  });
  const { scrollYProgress: departure } = useScroll({
    target: track,
    offset: [`end ${100 + LEAVE_VH + CLOSE_VH}%`, `end ${100 + CLOSE_VH}%`],
  });
  const { scrollYProgress: closing } = useScroll({
    target: track,
    offset: [`end ${100 + CLOSE_VH}%`, 'end end'],
  });
  const arrive = useSpring(arrival, OPENER_SPRING);
  const desk = useSpring(deskRunway, OPENER_SPRING);
  const leave = useSpring(departure, OPENER_SPRING);
  const close = useSpring(closing, OPENER_SPRING);

  const zoomIn = useTransform(arrive, OPENER_SETTLES, [START_SCALE, 1]);
  const zoomOut = useTransform(leave, [0, 1], [1, END_SCALE]);
  const recede = useTransform(close, [0, 1], [1, CLOSED_SCALE / END_SCALE]);
  const laptopScale = useTransform(
    [zoomIn, zoomOut, recede],
    ([entering, leaving, receding]: number[]) => entering * leaving * receding,
  );
  const laptopY = useTransform(close, LAPTOP_RISES, ['0vh', RISEN_OUT]);
  const lineOpacity = useTransform(arrive, OPENER_LINE, [0, 1, 1, 0]);

  const dockY = useTransform(desk, DOCK_SHOWS.slice(0, 2), ['140%', '0%']);
  const dockOpacity = useTransform(desk, DOCK_SHOWS, [0, 1, 1, 0]);
  const iconScale = useTransform(desk, ICON_CLICK, [1, 1.35, 1]);
  const iconRunning = useTransform(desk, ICON_OPENS, [0, 0.8]);
  const labelOpacity = useTransform(desk, LABEL_SHOWS, [0, 1, 1, 0]);
  const documentScale = useTransform(
    desk,
    DOCUMENT_OPENS,
    [DOCUMENT_ICON_SCALE, 1],
    { ease: easeInOut },
  );
  const documentOpacity = useTransform(desk, DOCUMENT_APPEARS, [0, 1]);
  const firstPageScale = useTransform(desk, FIRST_PAGE_SETTLES, [
    FIRST_PAGE_ZOOM,
    1,
  ]);
  const firstPageOpacity = useTransform(desk, FIRST_PAGE_FADES, [1, 0]);

  // The display goes dark and the pin takes a solid backdrop before the lid folds down.
  const screenOff = useTransform(close, SCREEN_GOES_DARK, [0, 1]);
  // Gone once the display is dark, so no layer of it can poke through the folded lid.
  const documentVisibility = useTransform(screenOff, (dark) =>
    dark < 1 ? 'visible' : 'hidden',
  );
  const lidAngle = useTransform(close, LID_FOLDS, [0, LID_CLOSED_DEGREES]);
  const backdrop = useTransform(
    screenOff,
    (alpha) =>
      `${theme.colors.background}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0')}`,
  );

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
  // The section in the document fades in as the first page clears, holds still and shrinks with the laptop as it leaves, and goes with the display.
  const documentSectionOpacity = useTransform(
    [useTransform(desk, FIRST_PAGE_FADES, [0, 1]), screenOff],
    ([shown, dark]: number[]) => shown * (1 - dark),
  );
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
      <Pin style={{ backgroundColor: backdrop }}>
        <Artwork
          style={{
            scale: laptopScale,
            y: laptopY,
            width: PINNED_WIDTH,
            transformOrigin: SCREEN_CENTRE,
          }}
        >
          <LaptopFrame lidAngle={lidAngle} screenOff={screenOff}>
            <Startup style={{ opacity: lineOpacity }}>
              <Statement {...onScreen.intro} exitOnScroll={false} />
            </Startup>
            <Dock style={{ y: dockY, opacity: dockOpacity }} aria-hidden="true">
              {DOCK_APPS.map(({ name, Icon, tint, running }) =>
                name === DOCUMENT_APP ? (
                  <DocumentIcon
                    key={name}
                    $tint={tint}
                    style={{ scale: iconScale }}
                  >
                    <Icon />
                    <small>PDF</small>
                    <RunningDot style={{ opacity: iconRunning }} />
                    <DockLabel style={{ opacity: labelOpacity }}>
                      {contentData.contact.cv}
                    </DockLabel>
                  </DocumentIcon>
                ) : (
                  <DockIcon key={name} $tint={tint} $running={running}>
                    <Icon />
                  </DockIcon>
                ),
              )}
            </Dock>
            <Document
              firstPageOpacity={firstPageOpacity}
              firstPageScale={firstPageScale}
              intro={inDock.intro}
              style={{
                scale: documentScale,
                opacity: documentOpacity,
                visibility: documentVisibility,
              }}
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
