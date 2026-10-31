import { MediaBlock } from '@components/motion/MediaBlock';
import { Statement } from '@components/motion/Statement';
import type { SectionBanner, SectionIntro } from '@data/types';
import { OPENER_SPRING } from '@styles/motion';
import {
  easeOut,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import styled from 'styled-components';

import { contextLine, exposureLine, playbackIndex } from './cameraPlayback';

/* Display rectangle of /media/images/camera.webp (rear of a Canon EOS R5 Mark II, CC0 by D. Benjamin Miller via Wikimedia Commons), in % of the artwork. */
const SCREEN = { left: 7.3, top: 44.6, width: 58.6, height: 50.2 };
const SCREEN_CENTRE = {
  x: SCREEN.left + SCREEN.width / 2,
  y: SCREEN.top + SCREEN.height / 2,
};
const ZOOM = 1.8;
/* The camera rises into place from below the viewport over this much scroll once its stage has pinned. */
const ENTER_VIEWPORTS = 0.35;
const READ_VIEWPORTS = 1.2;
const ZOOM_VIEWPORTS = 1.2;
const VIEWPORTS_PER_PHOTO = 0.75;
const INTRO_FADE_OUT_START = 0.8;

const CameraTrack = styled.div<{ $photos: number }>`
  height: calc(
    ${(ENTER_VIEWPORTS + READ_VIEWPORTS + ZOOM_VIEWPORTS + 1) * 100}vh +
      ${({ $photos }) => ($photos - 1) * VIEWPORTS_PER_PHOTO * 100}vh
  );
`;

const CameraStage = styled.div`
  position: sticky;
  top: 0;
  display: grid;
  place-items: center;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
`;

const Entrance = styled(motion.div)`
  will-change: transform;
`;

const CameraBody = styled(motion.div)`
  --screen: min(72vw, 93vh);
  position: relative;
  width: calc(var(--screen) / ${SCREEN.width / 100} / ${ZOOM});
  will-change: transform;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    --screen: min(92vw, 93vh);
  }
`;

const CameraScreen = styled.div`
  position: absolute;
  left: ${SCREEN.left}%;
  top: ${SCREEN.top}%;
  width: ${SCREEN.width}%;
  height: ${SCREEN.height}%;
  overflow: hidden;
  border-radius: 1.5% / 2.25%;
  background: #000;
  color: #fff;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0.1),
      transparent 42%,
      rgba(255, 255, 255, 0.04) 85%
    );
  }
`;

const FilmStrip = styled(motion.div)`
  display: flex;
  height: 100%;
  will-change: transform;
`;

const PlaybackFrame = styled.div`
  flex: 0 0 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Readout = styled(motion.span)`
  position: absolute;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: clamp(0.45rem, 0.85vw, 0.8rem);
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
`;

const Counter = styled(Readout)`
  top: 4%;
  right: 4%;
`;

const Caption = styled(Readout)`
  left: 4%;
  bottom: 4%;
  max-width: 46%;
`;

const ShotDetails = styled(Readout).attrs({ as: 'span' })`
  right: 4%;
  bottom: 4%;
  max-width: 48%;
  text-align: right;
  opacity: 0.9;
`;

const DetailLine = styled(motion.span)`
  display: block;
`;

const StartupScreen = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};

  && > section {
    padding: 4% 2%;
  }

  && p {
    font-size: clamp(0.8rem, 1.3vw, 1.25rem);
  }

  && p:first-of-type {
    font-size: clamp(0.45rem, 0.7vw, 0.65rem);
  }
`;

interface CameraProps {
  intro?: SectionIntro;
  photos: SectionBanner[];
}

export const Camera = ({ intro, photos }: CameraProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, OPENER_SPRING);

  const runway =
    ENTER_VIEWPORTS +
    READ_VIEWPORTS +
    ZOOM_VIEWPORTS +
    (photos.length - 1) * VIEWPORTS_PER_PHOTO;
  const enterEnd = ENTER_VIEWPORTS / runway;
  const zoomStart = (ENTER_VIEWPORTS + READ_VIEWPORTS) / runway;
  const zoomEnd = zoomStart + ZOOM_VIEWPORTS / runway;

  const entry = useTransform(progress, [0, enterEnd], ['100vh', '0vh'], {
    ease: easeOut,
  });
  const scale = useTransform(progress, [zoomStart, zoomEnd], [1, ZOOM]);
  const startupOpacity = useTransform(
    progress,
    [zoomEnd * INTRO_FADE_OUT_START, zoomEnd],
    [1, 0],
  );
  const index = useTransform(progress, (value) =>
    playbackIndex(value, zoomEnd, photos.length),
  );
  const stripX = useTransform(index, (current) => `${-current * 100}%`);
  const currentPhoto = (current: number) => photos[Math.round(current)];
  const counter = useTransform(
    index,
    (current) => `${Math.round(current) + 1}/${photos.length}`,
  );
  const caption = useTransform(
    index,
    (current) => currentPhoto(current)?.caption ?? '',
  );
  const exposure = useTransform(index, (current) =>
    exposureLine(currentPhoto(current)?.exif),
  );
  const context = useTransform(index, (current) =>
    contextLine(currentPhoto(current)?.exif),
  );

  if (reduceMotion || photos.length === 0) {
    return (
      <>
        {intro && <Statement {...intro} />}
        {photos.map((photo, position) => (
          <MediaBlock
            key={photo.image}
            align={position % 2 ? 'right' : 'left'}
            {...photo}
          />
        ))}
      </>
    );
  }

  return (
    <CameraTrack ref={ref} $photos={photos.length}>
      <CameraStage>
        <Entrance style={{ y: entry }}>
          <CameraBody
            style={{
              scale,
              x: `${50 - SCREEN_CENTRE.x}%`,
              y: `${50 - SCREEN_CENTRE.y}%`,
              transformOrigin: `${SCREEN_CENTRE.x}% ${SCREEN_CENTRE.y}%`,
            }}
          >
            <img
              src="/media/images/camera.webp"
              alt=""
              width={2000}
              height={1558}
              loading="lazy"
            />
            <CameraScreen>
              <FilmStrip style={{ x: stripX }}>
                {photos.map((photo) => (
                  <PlaybackFrame key={photo.image}>
                    <img
                      src={`/media/images/${photo.image}`}
                      alt={photo.alt ?? ''}
                      loading="lazy"
                    />
                  </PlaybackFrame>
                ))}
              </FilmStrip>
              <Counter aria-hidden="true">{counter}</Counter>
              <Caption aria-hidden="true">{caption}</Caption>
              <ShotDetails aria-hidden="true">
                <DetailLine>{exposure}</DetailLine>
                <DetailLine>{context}</DetailLine>
              </ShotDetails>
              {intro && (
                <StartupScreen style={{ opacity: startupOpacity }}>
                  <Statement {...intro} animate={false} />
                </StartupScreen>
              )}
            </CameraScreen>
          </CameraBody>
        </Entrance>
      </CameraStage>
    </CameraTrack>
  );
};
