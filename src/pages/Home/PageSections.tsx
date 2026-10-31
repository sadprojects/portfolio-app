import { Desk, type DeskApp } from '@components/openers/Desk';
import type { SectionId } from '@data/types';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Grid, col } from '@styles/grid';
import { useReducedMotion } from 'framer-motion';
import { Fragment, Suspense, type ComponentType } from 'react';
import styled from 'styled-components';

import { SectionOpener } from './SectionOpener';
import { SECTIONS } from './sections';

const PHONE = '(max-width: 768px)';

/* On wide screens one laptop hosts these two: the first on its screen, the second opened from its dock as the CV. Phones and reduced motion get an opener and the body for each. */
const DESK: [SectionId, SectionId] = ['projects', 'skills'];

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

// Both desk sections are registered with a body and an intro; sections.test guards it.
const deskApp = (id: SectionId): DeskApp => {
  const { Component, intro } = SECTIONS.find((section) => section.id === id)!;
  return { id, intro: intro!, body: sectionBody(Component!) };
};

export const PageSections = () => {
  const reduceMotion = useReducedMotion();
  const phone = useMediaQuery(PHONE);
  const desk = !reduceMotion && !phone;

  return (
    <>
      {SECTIONS.map(({ id, Component, transition, intro, banners }) => {
        if (!Component) return null;
        if (desk && DESK.includes(id)) {
          return id === DESK[0] ? (
            <Desk
              key={id}
              onScreen={deskApp(DESK[0])}
              inDock={deskApp(DESK[1])}
            />
          ) : null;
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
                <SectionInset>{sectionBody(Component)}</SectionInset>
              </Grid>
            </SectionBody>
          </Fragment>
        );
      })}
    </>
  );
};
