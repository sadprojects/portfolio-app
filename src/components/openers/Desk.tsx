import { Statement } from '@components/motion/Statement';
import { contentData } from '@data/content';
import type { SectionId, SectionIntro } from '@data/types';
import { OPENER_SPRING } from '@styles/motion';
import {
  easeIn,
  easeInOut,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Compass,
  FileText,
  Folder,
  Image,
  Mail,
  Music,
  Settings,
  StickyNote,
  Terminal,
} from 'lucide-react';
import {
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from 'react';
import styled from 'styled-components';

import { Scrollbar, Startup } from './Cutout';
import { Genie } from './Genie';
import type { GenieOrigin } from './genieSlice';
import { LaptopFrame, ScreenInset } from './Laptop';
import {
  ARTWORK,
  MENU_BAR_HEIGHT,
  PINNED_WIDTH,
  SCREEN,
  SCREEN_CENTRE,
} from './laptopArtwork';
import { MenuBar } from './MenuBar';
import { ResumeFrame, ResumeStill } from './Resume';

export interface DeskApp {
  id: SectionId;
  intro: SectionIntro;
  body: ReactNode;
}

/* Scroll runways in viewports: the laptop zooms in and its line is read over the first (and 0.7 before it pins); each section settles past its end, so nothing sits under the dock or the fold; the dock, the document and its first page take 2.4; the laptop shrinks away over 0.75, then closes its lid and rises out of the viewport over 1.4, and the camera follows from below. */
const ARRIVE_VH = 170;
const DESK_VH = 240;
const SETTLE_VH = 33;
const LEAVE_VH = 75;
const CLOSE_VH = 140;
const START_SCALE = 2.2;
const END_SCALE = 0.55;
const LID_CLOSED_DEGREES = -80;

/* Beats of the arrival: the laptop settles over the first part, and its line fades in, holds to be read, and fades out, leaving the screen clear before the section enters. */
const LAPTOP_SETTLES = [0, 0.55];
const LINE_SHOWS = [0.04, 0.3, 0.78, 0.91];
/* Beats of the desk runway, as progress: the dock rises, the CV's icon is clicked and labelled, the document genies up out of it over the section on screen, its first page holds to be read, then the page scrolls up out of the viewer with the section following right behind it, one scroll with the page. */
const DOCK_SHOWS = [0, 0.07, 0.6, 0.66];
const ICON_CLICK = [0.07, 0.1, 0.14];
const ICON_OPENS = [0.1, 0.14];
const LABEL_SHOWS = [0.07, 0.1, 0.22, 0.26];
/* The genie: the document is pulled out of its icon through a funnel, as the Dock does it, and the real window takes over the moment it is whole. The still it is built from is mounted only around that beat. */
const GENIE_OPENS = [0.14, 0.48];
const GENIE_MOUNTED = [0.03, 0.5];
const SCREEN_SECTION_FADES = [0.34, 0.48];
const DOCUMENT_SECTION_SHOWS = [0.48, 0.5];
const FIRST_PAGE_SCROLLS = [0.6, 1];
/* Beats of the closing runway: a sheet of the CV covers the page, the lid folds down onto the keyboard with it still on, and the laptop rises out of the viewport before the fold is done; the camera, pinned underneath from then on, rises into its place from below. Nothing scales during the fold, so the lid's layer is never re-rasterised mid-turn. */
const SHEET_COVERS = [0, 0.15];
const LID_FOLDS = [0.15, 0.6];
const LAPTOP_RISES = [0.4, 0.8];
const RISEN_OUT = '-100vh';

/* The dock's apps, as tinted tiles; the CV sits at the right end, where the document genies up from. */
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
    name: 'mail',
    Icon: Mail,
    tint: 'linear-gradient(160deg, #5ac8fa, #1f7ae0)',
  },
  {
    name: 'photos',
    Icon: Image,
    tint: 'conic-gradient(from 200deg, #ff7a59, #ffd166, #7bd389, #4cc9f0, #c77dff, #ff7a59)',
  },
  {
    name: 'notes',
    Icon: StickyNote,
    tint: 'linear-gradient(160deg, #ffe27a, #f4b400)',
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
  {
    name: 'cv',
    Icon: FileText,
    tint: 'linear-gradient(160deg, #ff7b72, #d93a4a)',
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

/* A formatting root, so the leaving runways (the last section's bottom margin) count towards the pin's travel. The next section is pinned underneath from the moment the laptop has risen out, so it can rise into the empty viewport; the pin then lets go unseen. */
const Track = styled.section`
  position: relative;
  display: flow-root;
  margin-bottom: -${100 + CLOSE_VH * (1 - LAPTOP_RISES[1])}vh;
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
  gap: 0.65em;
  height: 10.5%;
  padding: 0.5em;
  translate: -50% 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.3em;
  background: rgba(255, 255, 255, 0.22);
  box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px);
  font-size: clamp(0.45rem, 0.8vw, 0.8rem);
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

/* Fills the screen below the menu bar once open. */
const Document = styled(ResumeFrame)`
  position: absolute;
  inset: ${MENU_BAR_HEIGHT}% 0 0 0;
  aspect-ratio: auto;
  will-change: opacity;
`;

/* Where the genie plays: the same box as the document. */
const GenieWindow = styled.div`
  position: absolute;
  inset: ${MENU_BAR_HEIGHT}% 0 0 0;
  pointer-events: none;
`;

/* The CV's icon in the dock, as fractions of the document's box below the menu bar, from layout alone (the dock's own slide does not count). */
const iconOrigin = (
  dock: HTMLElement,
  icon: HTMLElement,
): GenieOrigin | null => {
  const screen = dock.offsetParent as HTMLElement | null;
  if (!screen) return null;
  return {
    x:
      (dock.offsetLeft -
        dock.offsetWidth / 2 +
        icon.offsetLeft +
        icon.offsetWidth / 2) /
      screen.offsetWidth,
    y:
      ((dock.offsetTop + icon.offsetTop + icon.offsetHeight / 2) /
        screen.offsetHeight -
        MENU_BAR_HEIGHT / 100) /
      (1 - MENU_BAR_HEIGHT / 100),
    width: icon.offsetWidth / screen.offsetWidth,
  };
};

/* Behind the pin and as wide as the screen; its first line enters at the screen's bottom edge once the laptop has settled and its line has cleared. */
const SectionOnScreen = styled(motion.div)`
  position: relative;
  isolation: isolate;
  width: var(--screen-width);
  margin: 0 auto;
  padding-top: ${ARRIVE_VH}vh;
  will-change: transform, opacity;
`;

/* Behind the document's page, above whatever section waits below the laptop. Its first line sits at the page's bottom edge the moment the first page starts scrolling, so the two move as one; it settles a little past its end (its page still painted below it), then holds still and shrinks with the laptop as it leaves, and goes under the closing sheet. */
const SectionInDocument = styled(SectionOnScreen)`
  z-index: 1;
  padding: ${SETTLE_VH + FIRST_PAGE_SCROLLS[0] * DESK_VH}vh 0 ${SETTLE_VH}vh;
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

/** A pinned laptop that hosts two sections: the first scrolls on its screen, then its dock rises, the CV's icon is clicked and the document opens to scroll the second; finally the laptop shrinks away with the document still open, closes its lid with a sheet of the CV on the screen, and rises out of the viewport for the camera to rise in behind it. */
export const Desk = ({ onScreen, inDock }: DeskProps) => {
  const track = useRef<HTMLElement>(null);
  const screenSection = useRef<HTMLDivElement>(null);
  const documentSection = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const documentIcon = useRef<HTMLSpanElement>(null);
  const [genie, setGenie] = useState<GenieOrigin | null>(null);
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
  // How far through each section the reader is, for the scrollbars: from its first line entering at the frame's bottom edge to its end settled.
  const { scrollYProgress: screenScrolled } = useScroll({
    target: screenSection,
    offset: [`start ${100 - ARRIVE_VH}%`, `end ${100 - SETTLE_VH}%`],
  });
  const { scrollYProgress: documentScrolled } = useScroll({
    target: documentSection,
    offset: [
      `start ${100 - SETTLE_VH - FIRST_PAGE_SCROLLS[0] * DESK_VH}%`,
      `end ${100 - SETTLE_VH}%`,
    ],
  });
  const arrive = useSpring(arrival, OPENER_SPRING);
  const desk = useSpring(deskRunway, OPENER_SPRING);
  const leave = useSpring(departure, OPENER_SPRING);
  const close = useSpring(closing, OPENER_SPRING);

  const zoomIn = useTransform(arrive, LAPTOP_SETTLES, [START_SCALE, 1]);
  const zoomOut = useTransform(leave, [0, 1], [1, END_SCALE], {
    ease: easeInOut,
  });
  const laptopScale = useTransform(
    [zoomIn, zoomOut],
    ([entering, leaving]: number[]) => entering * leaving,
  );
  const laptopY = useTransform(close, LAPTOP_RISES, ['0vh', RISEN_OUT], {
    ease: easeIn,
  });
  const lineOpacity = useTransform(arrive, LINE_SHOWS, [0, 1, 1, 0]);
  // The line can be selected while it shows; afterwards the pin lets clicks through to the section.
  const linePointerEvents = useTransform(lineOpacity, (visible) =>
    visible > 0 ? 'auto' : 'none',
  );

  const dockY = useTransform(desk, DOCK_SHOWS.slice(0, 2), ['140%', '0%']);
  const dockOpacity = useTransform(desk, DOCK_SHOWS, [0, 1, 1, 0]);
  // Gone when faded, so its blur costs nothing while the laptop closes.
  const dockVisibility = useTransform(dockOpacity, (visible) =>
    visible > 0 ? 'visible' : 'hidden',
  );
  const iconScale = useTransform(desk, ICON_CLICK, [1, 1.35, 1]);
  const iconRunning = useTransform(desk, ICON_OPENS, [0, 0.8]);
  const labelOpacity = useTransform(desk, LABEL_SHOWS, [0, 1, 1, 0]);
  const genieProgress = useTransform(desk, GENIE_OPENS, [0, 1]);
  // The real window takes over the moment the genie is whole.
  const documentOpacity = useTransform(
    desk,
    [GENIE_OPENS[1] - 0.003, GENIE_OPENS[1]],
    [0, 1],
  );
  useMotionValueEvent(desk, 'change', (progress) => {
    const wanted = progress > GENIE_MOUNTED[0] && progress < GENIE_MOUNTED[1];
    setGenie((current) => {
      if (!wanted) return null;
      if (current || !dock.current || !documentIcon.current) return current;
      return iconOrigin(dock.current, documentIcon.current);
    });
  });
  // Raw, not sprung, so the page and the section behind it stay locked together.
  const firstPageY = useTransform(
    deskRunway,
    (progress) =>
      (-Math.max(0, progress - FIRST_PAGE_SCROLLS[0]) *
        DESK_VH *
        viewportHeight()) /
      100,
  );

  const sheetCover = useTransform(close, SHEET_COVERS, [0, 1]);
  const lidAngle = useTransform(close, LID_FOLDS, [0, LID_CLOSED_DEGREES], {
    ease: easeInOut,
  });

  // The section on screen holds its last screen while the document opens over it, then goes.
  const screenSectionOpacity = useTransform(desk, SCREEN_SECTION_FADES, [1, 0]);
  // The screen's scrollbar shows once the line has cleared and goes with the section.
  const screenBarOpacity = useTransform(
    [lineOpacity, screenSectionOpacity],
    ([line, section]: number[]) => (1 - line) * section,
  );
  const screenSectionHold = useTransform(
    [deskRunway, screenSectionOpacity],
    ([progress, visible]: number[]) =>
      visible > 0 ? (progress * DESK_VH * viewportHeight()) / 100 : 0,
  );
  const screenSectionVisibility = useTransform(
    screenSectionOpacity,
    (visible) => (visible > 0 ? 'visible' : 'hidden'),
  );
  // The section in the document is there once the section on screen has gone, holds still and shrinks with the laptop as it leaves, and goes under the closing sheet.
  const documentSectionOpacity = useTransform(
    [useTransform(desk, DOCUMENT_SECTION_SHOWS, [0, 1]), sheetCover],
    ([shown, covered]: number[]) => shown * (1 - covered),
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
      <Pin>
        <Artwork
          style={{
            scale: laptopScale,
            y: laptopY,
            width: PINNED_WIDTH,
            transformOrigin: SCREEN_CENTRE,
          }}
        >
          <LaptopFrame lidAngle={lidAngle} screenCovered={sheetCover}>
            <Startup
              style={{ opacity: lineOpacity, pointerEvents: linePointerEvents }}
            >
              <Statement {...onScreen.intro} exitOnScroll={false} />
            </Startup>
            <Scrollbar
              progress={screenScrolled}
              opacity={screenBarOpacity}
              top={MENU_BAR_HEIGHT}
            />
            <Dock
              ref={dock}
              style={{
                y: dockY,
                opacity: dockOpacity,
                visibility: dockVisibility,
              }}
              aria-hidden="true"
            >
              {DOCK_APPS.map(({ name, Icon, tint, running }) =>
                name === DOCUMENT_APP ? (
                  <DocumentIcon
                    key={name}
                    ref={documentIcon}
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
              firstPageY={firstPageY}
              closingOpacity={sheetCover}
              intro={inDock.intro}
              scrolled={documentScrolled}
              style={{ opacity: documentOpacity }}
            />
            {genie && (
              <GenieWindow>
                <Genie progress={genieProgress} origin={genie}>
                  <ResumeStill intro={inDock.intro} />
                </Genie>
              </GenieWindow>
            )}
            <MenuBar />
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
        ref={documentSection}
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
