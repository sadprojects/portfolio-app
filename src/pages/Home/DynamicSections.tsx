import { CertificationsSkeleton } from '@components/skeletons/CertificationsSkeleton';
import { ContactSkeleton } from '@components/skeletons/ContactSkeleton';
import { ExperienceSkeleton } from '@components/skeletons/ExperienceSkeleton';
import { HobbiesSkeleton } from '@components/skeletons/HobbiesSkeleton';
import { ProjectsSkeleton } from '@components/skeletons/ProjectsSkeleton';
import { SkillsSkeleton } from '@components/skeletons/SkillsSkeleton';
import type { SectionConfig } from '@utils/sectionBuilder';
import { motion } from 'framer-motion';
import { lazy, memo, Suspense } from 'react';
import styled from 'styled-components';

const Certifications = lazy(() => import('@pages/Certifications'));
const Contact = lazy(() => import('@pages/Contact'));
const Experience = lazy(() => import('@pages/Experience'));
const Hobbies = lazy(() => import('@pages/Hobbies'));
const Projects = lazy(() => import('@pages/Projects'));
const Skills = lazy(() => import('@pages/Skills'));

const Section = styled(motion.section)`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 8rem 2rem 4rem;
  scroll-margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 6rem 0.25rem 3rem;
    scroll-margin-top: 3.5rem;
  }
`;

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface DynamicSectionsProps {
  sections: SectionConfig[];
  sectionChecks: {
    hasProjects: boolean;
    hasCertifications: boolean;
    hasSkills: boolean;
    hasExperience: boolean;
    hasHobbies: boolean;
    hasContact: boolean;
  };
}

export const DynamicSections = memo(
  ({ sections, sectionChecks }: DynamicSectionsProps) => {
    const {
      hasProjects,
      hasCertifications,
      hasSkills,
      hasExperience,
      hasHobbies,
      hasContact,
    } = sectionChecks;

    const getFallback = (
      useSkeleton: boolean,
      SkeletonComponent: React.ComponentType,
    ) => {
      return useSkeleton ? (
        <SkeletonComponent />
      ) : (
        <div style={{ minHeight: '80vh' }} />
      );
    };

    return (
      <>
        {sections.slice(1).map((section) => {
          const useSkeleton = section.useSkeleton ?? false;

          switch (section.id) {
            case 'projects':
              return hasProjects ? (
                <Section
                  key={section.id}
                  data-section="projects"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={sectionVariants}
                >
                  <Suspense
                    fallback={getFallback(useSkeleton, ProjectsSkeleton)}
                  >
                    <Projects />
                  </Suspense>
                </Section>
              ) : null;
            case 'certifications':
              return hasCertifications ? (
                <Section
                  key={section.id}
                  data-section="certifications"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={sectionVariants}
                >
                  <Suspense
                    fallback={getFallback(useSkeleton, CertificationsSkeleton)}
                  >
                    <Certifications />
                  </Suspense>
                </Section>
              ) : null;
            case 'skills':
              return hasSkills ? (
                <Section
                  key={section.id}
                  data-section="skills"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={sectionVariants}
                >
                  <Suspense fallback={getFallback(useSkeleton, SkillsSkeleton)}>
                    <Skills />
                  </Suspense>
                </Section>
              ) : null;
            case 'experience':
              return hasExperience ? (
                <Section
                  key={section.id}
                  data-section="experience"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={sectionVariants}
                >
                  <Suspense
                    fallback={getFallback(useSkeleton, ExperienceSkeleton)}
                  >
                    <Experience />
                  </Suspense>
                </Section>
              ) : null;
            case 'hobbies':
              return hasHobbies ? (
                <Section
                  key={section.id}
                  data-section="hobbies"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={sectionVariants}
                >
                  <Suspense
                    fallback={getFallback(useSkeleton, HobbiesSkeleton)}
                  >
                    <Hobbies />
                  </Suspense>
                </Section>
              ) : null;
            case 'contact':
              return hasContact ? (
                <Section
                  key={section.id}
                  data-section="contact"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={sectionVariants}
                >
                  <Suspense
                    fallback={getFallback(useSkeleton, ContactSkeleton)}
                  >
                    <Contact />
                  </Suspense>
                </Section>
              ) : null;
            default:
              return null;
          }
        })}
      </>
    );
  },
);

DynamicSections.displayName = 'DynamicSections';
