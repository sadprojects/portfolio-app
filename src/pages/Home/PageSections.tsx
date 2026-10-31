import { Grid, col } from '@styles/grid';
import { Fragment, Suspense } from 'react';
import styled from 'styled-components';

import { SectionOpener } from './SectionOpener';
import { SECTIONS } from './sections';

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

export const PageSections = () => (
  <>
    {SECTIONS.map(({ id, Component, transition, intro, banners }) =>
      Component ? (
        <Fragment key={id}>
          <SectionOpener
            transition={transition}
            intro={intro}
            banners={banners}
          />
          <SectionBody data-section={id}>
            <Grid>
              <SectionInset>
                <Suspense fallback={<SectionPlaceholder />}>
                  <Component />
                </Suspense>
              </SectionInset>
            </Grid>
          </SectionBody>
        </Fragment>
      ) : null,
    )}
  </>
);
