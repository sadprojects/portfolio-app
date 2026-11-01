import { Header } from '@components/Header/Header';
import { ScrollProgress } from '@components/ui/ScrollProgress';
import { contentData } from '@data/content';
import { useSectionScroll } from '@hooks/useSectionScroll';
import { useSmoothScroll } from '@hooks/useSmoothScroll';
import { yearsSince } from '@utils/dates';
import { useRef } from 'react';
import styled from 'styled-components';

import { AboutSection } from './AboutSection';
import { HeroSection } from './HeroSection';
import { PageSections } from './PageSections';
import { SECTIONS } from './sections';
import { TableOfContents } from './TableOfContents';

const ABOUT_SCROLL_OFFSET_PX = -32;

const HomeSection = styled.section`
  scroll-margin-top: 4rem;
`;

const Home = () => {
  const { contact } = contentData;
  const scrollTo = useSmoothScroll();
  const { activeSection, containerRef, scrollToSection } =
    useSectionScroll(scrollTo);
  const aboutRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollProgress />
      <Header sections={SECTIONS} onNavigate={scrollToSection} />
      <div ref={containerRef}>
        <TableOfContents
          sections={SECTIONS}
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />

        <HomeSection data-section="home">
          <HeroSection
            onViewWork={() => scrollToSection(SECTIONS[1].id)}
            onScrollDown={() =>
              aboutRef.current &&
              scrollTo(aboutRef.current, ABOUT_SCROLL_OFFSET_PX)
            }
          />
          <AboutSection
            ref={aboutRef}
            age={yearsSince(contact.birthDate)}
            yearsOfExperience={yearsSince(contact.firstJobDate)}
          />
        </HomeSection>

        <PageSections />
      </div>
    </>
  );
};

export default Home;
