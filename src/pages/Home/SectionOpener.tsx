import { Statement } from '@components/motion/Statement';
import { Camera } from '@components/openers/Camera';
import { Laptop } from '@components/openers/Laptop';
import { Resume } from '@components/openers/Resume';
import { Zoom } from '@components/openers/Zoom';
import { motion, useReducedMotion } from 'framer-motion';

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
  if (reduceMotion) return <Statement {...intro} />;
  if (transition === 'resume') return <Resume intro={intro} />;
  if (transition === 'laptop') {
    return (
      <Laptop>
        <Statement {...intro} exitOnScroll={false} />
      </Laptop>
    );
  }
  return (
    <Zoom width="min(92vw, 72rem)">
      {(opacity) => (
        <motion.div style={{ opacity }}>
          <Statement {...intro} />
        </motion.div>
      )}
    </Zoom>
  );
};
