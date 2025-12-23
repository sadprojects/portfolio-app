import { Header } from '@components/Header/Header';
import { useSectionScroll } from '@hooks/useSectionScroll';
import { DynamicSections } from '@pages/Home/DynamicSections';
import { HeroSection } from '@pages/Home/HeroSection';
import { TableOfContents } from '@pages/Home/TableOfContents';
import { useHomeData } from '@pages/Home/useHomeData';
import { usePDFDownload } from '@pages/Home/usePDFDownload';
import { memo, useCallback, useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;

  /* Enable iOS tap status bar to scroll to top */
  -webkit-overflow-scrolling: touch;
`;

const HomeSection = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  scroll-margin-top: 4rem;

  @media (max-width: 768px) {
    scroll-margin-top: 3.5rem;
  }
`;

const Home = memo(() => {
  const [isDraggingTOC, setIsDraggingTOC] = useState(false);
  const [isTOCExpanded, setIsTOCExpanded] = useState(false);

  // Extract data and derived values
  const {
    contact,
    projects,
    technologies,
    age,
    yearsOfExperience,
    sectionChecks,
    sections,
    firstSection,
  } = useHomeData();

  // Extract PDF generation logic
  const { isGeneratingPDF, handleDownloadCV } = usePDFDownload();

  // Use section scroll hook
  const { activeSection, containerRef, scrollToSection } = useSectionScroll({ isDraggingTOC });

  const handleViewWork = useCallback(() => {
    if (firstSection) {
      scrollToSection(firstSection.id);
    }
  }, [firstSection, scrollToSection]);

  return (
    <>
      <Header
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        isTOCExpanded={isTOCExpanded}
      />
      <PageContainer ref={containerRef}>
        <TableOfContents
          sections={sections}
          activeSection={activeSection}
          onNavigate={scrollToSection}
          onDraggingChange={setIsDraggingTOC}
          onExpandedChange={setIsTOCExpanded}
        />

        <HomeSection data-section="home">
          <HeroSection
            age={age}
            position={contact.position}
            location={contact.location}
            yearsOfExperience={yearsOfExperience}
            projectsCount={projects.length}
            technologiesCount={technologies?.items?.filter(t => t.enabled !== false).length || 0}
            hasProjects={sectionChecks.hasProjects}
            firstSectionId={firstSection?.id}
            isGeneratingPDF={isGeneratingPDF}
            onViewWork={handleViewWork}
            onDownloadCV={handleDownloadCV}
          />
        </HomeSection>

        <DynamicSections sections={sections} sectionChecks={sectionChecks} />
      </PageContainer>
    </>
  );
});

export default Home;
