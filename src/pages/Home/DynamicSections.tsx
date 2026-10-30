import { MediaBlock } from '@components/motion/MediaBlock';
import { Statement } from '@components/motion/Statement';
import { SectionSkeleton } from '@components/SectionSkeleton/SectionSkeleton';
import { Grid, col } from '@styles/grid';
import type { SectionChecks, SectionConfig } from '@utils/sectionBuilder';
import { Fragment, lazy, Suspense } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: clamp(1rem, 3vw, 4rem) 0 clamp(4rem, 8vw, 10rem);
  scroll-margin-top: 4rem;
`;

const Inset = styled.div`
  ${col('2 / 12', '1 / -1')}
  min-width: 0;
`;

type Entry = {
  check: keyof SectionChecks;
  Component: React.LazyExoticComponent<React.ComponentType>;
};

const registry: Record<string, Entry> = {
  projects: {
    check: 'hasProjects',
    Component: lazy(() => import('@pages/Projects')),
  },
  skills: {
    check: 'hasSkills',
    Component: lazy(() => import('@pages/Skills')),
  },
  experience: {
    check: 'hasExperience',
    Component: lazy(() => import('@pages/Experience')),
  },
  hobbies: {
    check: 'hasHobbies',
    Component: lazy(() => import('@pages/Hobbies')),
  },
};

interface DynamicSectionsProps {
  sections: SectionConfig[];
  sectionChecks: SectionChecks;
}

/** Each enabled section in order: statement line, optional photo, then the section itself. */
export const DynamicSections = ({
  sections,
  sectionChecks,
}: DynamicSectionsProps) => (
  <>
    {sections.slice(1).map((section) => {
      const entry = registry[section.id];
      if (!entry || !sectionChecks[entry.check]) return null;
      const { Component } = entry;
      return (
        <Fragment key={section.id}>
          {section.intro && <Statement {...section.intro} />}
          {section.banners?.map((banner, i) => (
            <MediaBlock
              key={banner.image}
              align={i % 2 ? 'right' : 'left'}
              {...banner}
            />
          ))}
          <Section data-section={section.id}>
            <Grid>
              <Inset>
                <Suspense
                  fallback={
                    section.useSkeleton ? (
                      <SectionSkeleton />
                    ) : (
                      <div style={{ minHeight: '60vh' }} />
                    )
                  }
                >
                  <Component />
                </Suspense>
              </Inset>
            </Grid>
          </Section>
        </Fragment>
      );
    })}
  </>
);
