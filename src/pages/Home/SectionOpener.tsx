import { Statement } from '@components/motion/Statement';
import { Camera } from '@components/openers/Camera';
import { Laptop } from '@components/openers/Laptop';
import { Resume } from '@components/openers/Resume';
import { FadeIn, Zoom } from '@components/openers/Zoom';
import { useReducedMotion } from 'framer-motion';

import type { Section } from './sections';

type SectionOpenerProps = Pick<Section, 'transition' | 'intro' | 'banners'>;

export const SectionOpener = ({
  transition = 'laptop',
  intro,
  banners = [],
}: SectionOpenerProps) => {
  const reduceMotion = useReducedMotion();

  if (transition === 'camera') return <Camera intro={intro} photos={banners} />;
  if (!intro) return null;
  if (transition === 'resume') return <Resume intro={intro} />;
  if (transition === 'laptop') {
    return (
      <Laptop>
        <Statement {...intro} exitOnScroll={false} />
      </Laptop>
    );
  }
  if (reduceMotion) return <Statement {...intro} />;
  return (
    <Zoom width="min(92vw, 72rem)">
      {(progress) => (
        <FadeIn progress={progress}>
          <Statement {...intro} />
        </FadeIn>
      )}
    </Zoom>
  );
};
