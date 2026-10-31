import { useInView, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import styled from 'styled-components';

const VIDEO_PRELOAD_MARGIN = '0px 0px 40% 0px';
const PLAY_ICON_SIZE = 56;

const Player = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
`;

const PlayerFacade = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: #000;
  color: #fff;
  cursor: pointer;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
  }

  svg {
    position: relative;
    filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.6));
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -4px;
  }
`;

const youtubeVideoId = (url: string) => {
  const parsed = new URL(url);
  return parsed.searchParams.get('v') ?? parsed.pathname.slice(1);
};

interface YouTubeProps {
  id: string;
  title: string;
}

const YouTube = ({ id, title }: YouTubeProps) => {
  const [playing, setPlaying] = useState(false);
  return playing ? (
    <Player
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
      title={`${title} video`}
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  ) : (
    <PlayerFacade
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title} video`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
      />
      <Play size={PLAY_ICON_SIZE} fill="currentColor" aria-hidden="true" />
    </PlayerFacade>
  );
};

interface ProjectMediaProps {
  video: string;
  title: string;
}

export const ProjectMedia = ({ video, title }: ProjectMediaProps) => {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const nearViewport = useInView(videoRef, {
    once: true,
    margin: VIDEO_PRELOAD_MARGIN,
  });

  if (video.includes('youtu')) {
    return <YouTube id={youtubeVideoId(video)} title={title} />;
  }
  return (
    <video
      ref={videoRef}
      src={nearViewport ? `/media/videos/${video}.mp4` : undefined}
      poster={`/media/videos/${video}.jpg`}
      muted
      loop
      autoPlay={!reduceMotion}
      controls={!!reduceMotion}
      playsInline
      preload="metadata"
      aria-label={`${title} demo`}
    />
  );
};
