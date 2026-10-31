import { LaptopWindow } from '@components/openers/Laptop';
import { ResumeWindow } from '@components/openers/Resume';
import type { WindowProps } from '@components/openers/ScrollFrame';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Grid, col } from '@styles/grid';
import { useReducedMotion } from 'framer-motion';
import { Fragment, Suspense, type ComponentType } from 'react';
import styled from 'styled-components';

import { SectionOpener } from './SectionOpener';
import { SECTIONS, type Section } from './sections';

const PHONE = '(max-width: 768px)';

/* Frames that keep the section inside them on wide screens; phones and reduced motion get the opener alone. */
const WINDOWS: Partial<
  Record<NonNullable<Section['transition']>, ComponentType<WindowProps>>
> = { laptop: LaptopWindow, resume: ResumeWindow };

const SectionBody = styled.section`
  padding: clamp(1rem, 3vw, 4rem) 0 clamp(4rem, 8vw, 10rem);
  scroll-margin-top: 4rem;
`;

const SectionInset = styled.div`
  ${col('2 / 12', '1 / -1')}
  min-width: 0;
`;

const SectionPlaceholder = styled.div`
  min-height: 60vh;
`;

export const PageSections = () => {
  const reduceMotion = useReducedMotion();
  const phone = useMediaQuery(PHONE);

  return (
    <>
      {SECTIONS.map(({ id, Component, transition, intro, banners }) => {
        if (!Component) return null;
        const body = (
          <Suspense fallback={<SectionPlaceholder />}>
            <Component />
          </Suspense>
        );
        const Window = transition && WINDOWS[transition];
        if (Window && intro && !reduceMotion && !phone) {
          return (
            <Window key={id} id={id} intro={intro}>
              {body}
            </Window>
          );
        }
        return (
          <Fragment key={id}>
            <SectionOpener
              transition={transition}
              intro={intro}
              banners={banners}
            />
            <SectionBody data-section={id}>
              <Grid>
                <SectionInset>{body}</SectionInset>
              </Grid>
            </SectionBody>
          </Fragment>
        );
      })}
    </>
  );
};
