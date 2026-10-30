import { Header } from '@components/Header/Header';
import { IntroLoader } from '@components/motion/IntroLoader';
import { ScrollProgress } from '@components/ScrollProgress';
import { useSectionScroll } from '@hooks/useSectionScroll';
import { startSmoothScroll } from '@lib/smoothScroll';
import { DynamicSections } from '@pages/Home/DynamicSections';
import { HeroSection } from '@pages/Home/HeroSection';
import { TableOfContents } from '@pages/Home/TableOfContents';
import { useHomeData } from '@pages/Home/useHomeData';
import { usePDFDownload } from '@pages/Home/usePDFDownload';
import { useEffect } from 'react';
import styled from 'styled-components';

const HomeSection = styled.section`
  scroll-margin-top: 4rem;
`;

const Home = () => {
  const { age, yearsOfExperience, sectionChecks, sections, firstSection } =
    useHomeData();
  const { isGeneratingPDF, handleDownloadCV } = usePDFDownload();
  const { activeSection, containerRef, scrollToSection } = useSectionScroll();

  useEffect(() => startSmoothScroll(), []);

  const handleViewWork = () => {
    if (firstSection) scrollToSection(firstSection.id);
  };

  return (
    <>
      <IntroLoader />
      <ScrollProgress />
      <Header
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
      <div ref={containerRef}>
        <TableOfContents
          sections={sections}
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />

        <HomeSection data-section="home">
          <HeroSection
            age={age}
            yearsOfExperience={yearsOfExperience}
            firstSectionId={firstSection?.id}
            isGeneratingPDF={isGeneratingPDF}
            onViewWork={handleViewWork}
            onDownloadCV={handleDownloadCV}
          />
        </HomeSection>

        <DynamicSections sections={sections} sectionChecks={sectionChecks} />
      </div>
    </>
  );
};

export default Home;
