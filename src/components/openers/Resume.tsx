import { Statement } from '@components/motion/Statement';
import type { SectionIntro } from '@data/types';
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import styled from 'styled-components';

import { Zoom } from './Zoom';

const START_SCALE = 2.6;
const HIGHLIGHT_FADE_IN = [0.05, 0.4];
const TEMPLATE_FADE_IN = [0.35, 0.75];
const CHIP_WIDTHS = ['18%', '12%', '22%', '15%', '10%', '19%'];

const Paper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  gap: clamp(1rem, 2.4vw, 2rem);
  height: min(86vh, 58rem);
  aspect-ratio: 1 / 1.3;
  margin: 0 auto;
  padding: clamp(1.25rem, 3vw, 3rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.xl};

  @media (max-width: 768px) {
    height: auto;
    width: 100%;
    aspect-ratio: auto;
  }
`;

const PlaceholderBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  &:last-child {
    align-self: end;
  }
`;

const PlaceholderBar = styled.span<{
  $width?: string;
  $height?: string;
  $dark?: boolean;
}>`
  display: block;
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '0.45rem'};
  border-radius: 999px;
  background: ${({ theme, $dark }) =>
    $dark ? theme.colors.secondary : theme.colors.border};
  opacity: ${({ $dark }) => ($dark ? 0.7 : 1)};
`;

const PlaceholderChips = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;

  ${PlaceholderBar} {
    height: 1.1rem;
    border-radius: 999px;
  }
`;

const PlaceholderGap = styled.span`
  display: block;
  height: 0.6rem;
`;

const Highlight = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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

interface ResumeSheetProps {
  progress: MotionValue<number>;
  intro: SectionIntro;
}

const ResumeSheet = ({ progress, intro }: ResumeSheetProps) => {
  const highlightOpacity = useTransform(progress, HIGHLIGHT_FADE_IN, [0, 1]);
  const templateOpacity = useTransform(progress, TEMPLATE_FADE_IN, [0, 1]);
  return (
    <Paper>
      <PlaceholderBlock style={{ opacity: templateOpacity }}>
        <PlaceholderBar $width="42%" $height="1.1rem" $dark />
        <PlaceholderBar $width="30%" />
        <PlaceholderGap />
        <PlaceholderBar $width="16%" $dark />
        <PlaceholderBar />
        <PlaceholderBar />
        <PlaceholderBar $width="72%" />
      </PlaceholderBlock>
      <Highlight style={{ opacity: highlightOpacity }}>
        <HighlightLabel>{intro.label}</HighlightLabel>
        <HighlightText>{intro.text}</HighlightText>
      </Highlight>
      <PlaceholderBlock style={{ opacity: templateOpacity }}>
        <PlaceholderBar $width="12%" $dark />
        <PlaceholderChips>
          {CHIP_WIDTHS.map((width) => (
            <PlaceholderBar key={width} $width={width} />
          ))}
        </PlaceholderChips>
        <PlaceholderGap />
        <PlaceholderBar $width="18%" $dark />
        <PlaceholderBar $width="88%" />
        <PlaceholderBar $width="56%" />
      </PlaceholderBlock>
    </Paper>
  );
};

export const Resume = ({ intro }: { intro: SectionIntro }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <Statement {...intro} />;
  return (
    <Zoom start={START_SCALE} width="min(92vw, 60rem)">
      {(progress) => <ResumeSheet progress={progress} intro={intro} />}
    </Zoom>
  );
};
