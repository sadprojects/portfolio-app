import { Desk, type DeskApp } from '@components/openers/Desk';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Grid, col } from '@styles/grid';
import { useReducedMotion } from 'framer-motion';
import { Fragment, Suspense, type ComponentType } from 'react';
import styled from 'styled-components';

import { SectionOpener } from './SectionOpener';
import { SECTIONS, type Section } from './sections';

const PHONE = '(max-width: 768px)';

/* On wide screens a laptop section directly followed by a resume section share one desk: the first on the laptop's screen, the second opened from its dock as the CV. Apart, and on phones or under reduced motion, each opens on its own. */
const sharesDesk = (index: number) =>
  SECTIONS[index]?.transition === 'laptop' &&
  SECTIONS[index + 1]?.transition === 'resume';

const SectionBody = styled.section`
  padding: clamp(1rem, 3vw, 4rem) 0 clamp(5.5rem, 12vw, 14.5rem);
  scroll-margin-top: 4rem;
`;

const SectionInset = styled.div`
  ${col('2 / 12', '1 / -1')}
  min-width: 0;
`;

const SectionPlaceholder = styled.div`
  min-height: 60vh;
`;

const sectionBody = (Component: ComponentType) => (
  <Suspense fallback={<SectionPlaceholder />}>
    <Component />
  </Suspense>
);

// A section with an opener has a body and a line; sections.test guards it.
const deskApp = ({ id, Component, intro }: Section): DeskApp => ({
  id,
  intro: intro!,
  body: sectionBody(Component!),
});

export const PageSections = () => {
  const reduceMotion = useReducedMotion();
  const phone = useMediaQuery(PHONE);
  const desk = !reduceMotion && !phone;

  return (
    <>
      {SECTIONS.map((section, index) => {
        const { id, Component, transition, intro, banners } = section;
        if (!Component) return null;
        if (desk && sharesDesk(index)) {
          return (
            <Desk
              key={id}
              onScreen={deskApp(section)}
              inDock={deskApp(SECTIONS[index + 1])}
              nextRisesIn={SECTIONS[index + 2]?.transition === 'camera'}
            />
          );
        }
        if (desk && sharesDesk(index - 1)) return null;
        return (
          <Fragment key={id}>
            <SectionOpener
              transition={transition}
              intro={intro}
              banners={banners}
            />
            <SectionBody data-section={id}>
              <Grid>
                <SectionInset>{sectionBody(Component)}</SectionInset>
              </Grid>
            </SectionBody>
          </Fragment>
        );
      })}
    </>
  );
};
