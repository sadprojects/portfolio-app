import Blinker from '@components/Blinker/Blinker';
import { Header } from '@components/Header/Header';
import { contentData } from '@data/content';
import Contact from '@pages/Contact';
import Experience from '@pages/Experience';
import Hobbies from '@pages/Hobbies';
import Projects from '@pages/Projects';
import { calculateAge, calculateYearsOfExperience } from '@utils/dateUtils';
import { downloadCV } from '@utils/pdfGenerator';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Camera, Download, FolderGit2, Home as HomeIcon, Loader as LoaderIcon, Sparkles, User } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BREAKPOINTS, FEATURES } from '../constants';

const PageContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TableOfContents = styled.nav`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 1s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  @media (max-width: 968px) {
    right: 1rem;
    padding: 0.75rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const TocList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding-left: 1.5rem;
  justify-content: stretch;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 1rem;
    bottom: 1rem;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const TocButton = styled.button<{ $active: boolean }>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem 1rem 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  color: ${({ theme, $active }) => $active ? theme.colors.foreground : theme.colors.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  border-radius: 0.5rem;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    left: -1.5rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme, $active }) => $active ? theme.colors.foreground : theme.colors.secondary};
    transition: all ${({ theme }) => theme.transitions.fast};
    z-index: 2;
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.foreground};
    background-color: ${({ theme }) => theme.colors.accent};

    &::before {
      background-color: ${({ theme }) => theme.colors.foreground};
      transform: scale(1.4);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }

  ${({ $active, theme }) => $active && `
    background-color: ${theme.colors.accent};

    &::before {
      transform: scale(1.4);
    }
  `}
`;

const TocLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 968px) {
    display: none;
  }
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  &[data-section="home"] {
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  &[data-section="projects"],
  &[data-section="experience"],
  &[data-section="hobbies"],
  &[data-section="contact"] {
    padding: 8rem 2rem 4rem;

    @media (max-width: 768px) {
      padding: 6rem 1.5rem 3rem;
    }
  }
`;

const HeroContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Greeting = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.foreground} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.foreground};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.foreground};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Stats = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  justify-items: center;

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Home = memo(() => {
  const { contact, projects, experience, photography, games } = contentData;
  const age = calculateAge(contact.birthDate);
  const yearsOfExperience = calculateYearsOfExperience(contact.firstJobDate);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  // const [shouldThrowError, setShouldThrowError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // if (shouldThrowError) {
  //   throw new Error('🔴 Error Boundary Test: This error was intentionally triggered!');
  // }

  const hasProjects = projects && projects.length > 0;
  const hasExperience = experience && experience.length > 0;
  const hasHobbies = (photography && photography.length > 0) || (games && games.length > 0);
  const hasContact = contact && (contact.email || contact.linkedin || contact.calendly);

  const sections = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    ...(hasProjects ? [{ id: 'projects', label: 'Projects', icon: FolderGit2 }] : []),
    ...(hasExperience ? [{ id: 'experience', label: 'Experience', icon: Briefcase }] : []),
    ...(hasHobbies ? [{ id: 'hobbies', label: 'Hobbies', icon: Camera }] : []),
    ...(hasContact ? [{ id: 'contact', label: 'Contact', icon: User }] : []),
  ];

  // Track active section based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sectionElements = container.querySelectorAll('[data-section]');
    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Handle scroll snapping based on 50% visibility threshold
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    let currentVisibleSection: string | null = null;
    let sectionVisibility = new Map<string, number>();

    const handleScroll = () => {
      if (FEATURES.DISABLE_MOBILE_SCROLL_SNAP && window.innerWidth <= BREAKPOINTS.mobile) {
        return;
      }

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const sections = container.querySelectorAll('[data-section]');
        const viewportHeight = window.innerHeight;
        let maxVisibility = 0;
        let mostVisibleSection: HTMLElement | null = null;
        let mostVisibleSectionId: string | null = null;

        sections.forEach((section) => {
          const el = section as HTMLElement;
          const rect = el.getBoundingClientRect();
          const sectionId = el.getAttribute('data-section');

          if (!sectionId) return;

          // Calculate visible portion of the section
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const sectionHeight = Math.min(rect.height, viewportHeight);
          const visibilityPercentage = (visibleHeight / sectionHeight) * 100;

          sectionVisibility.set(sectionId, visibilityPercentage);

          if (visibilityPercentage > maxVisibility) {
            maxVisibility = visibilityPercentage;
            mostVisibleSection = el;
            mostVisibleSectionId = sectionId;
          }
        });

        // If current section is less than 50% visible, snap to the most visible section
        if (currentVisibleSection && mostVisibleSectionId) {
          const currentVisibility = sectionVisibility.get(currentVisibleSection) || 0;

          if (currentVisibility < 50 && mostVisibleSectionId !== currentVisibleSection) {
            // Snap to the section that's most visible
            if (mostVisibleSection) {
              const targetSection = mostVisibleSection as HTMLElement;
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              currentVisibleSection = mostVisibleSectionId;
            }
          } else if (currentVisibility >= 50) {
            // Update current section if it's still more than 50% visible
            currentVisibleSection = mostVisibleSectionId;
          }
        } else {
          // Initialize current section
          currentVisibleSection = mostVisibleSectionId;
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadCV = async () => {
    setIsGeneratingPDF(true);
    try {
      await downloadCV();
    } catch (error) {
      console.error('Failed to download CV:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      <Header
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
      <PageContainer ref={containerRef}>
      <TableOfContents>
        <TocList>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <TocButton
                key={section.id}
                $active={activeSection === section.id}
                onClick={() => scrollToSection(section.id)}
                aria-label={`Go to ${section.label}`}
              >
                <Icon size={18} />
                <TocLabel>{section.label}</TocLabel>
              </TocButton>
            );
          })}
        </TocList>
      </TableOfContents>

      {/* Home Section */}
      <Section data-section="home">
        <HeroContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Greeting variants={itemVariants}>
              <Sparkles size={16} />
              Welcome to my portfolio
            </Greeting>

            <Title variants={itemVariants}>
              <Blinker text={`Hi, I'm ${contact.name.split(' ')[0]}`} />
            </Title>

            <Subtitle variants={itemVariants}>
              {age}-year-old {contact.position} based in {contact.location}.
              Building exceptional digital experiences with modern web technologies.
            </Subtitle>

            <ButtonGroup variants={itemVariants}>
              <PrimaryButton onClick={() => scrollToSection('projects')}>
                View My Work
                <ArrowRight size={20} />
              </PrimaryButton>
              <SecondaryButton onClick={handleDownloadCV} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <>
                    <LoaderIcon size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Download CV
                  </>
                )}
              </SecondaryButton>
              {/* <SecondaryButton
                onClick={() => {
                  if (window.confirm('This will intentionally crash the page to test the error boundary. Continue?')) {
                    setShouldThrowError(true);
                  }
                }}
                style={{
                  opacity: 0.5,
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.5rem',
                  minWidth: '3rem'
                }}
                title="Test Error Boundary"
              >
                🔴 Test
              </SecondaryButton> */}
            </ButtonGroup>

            <Stats variants={itemVariants}>
              <Stat>
                <StatValue>{yearsOfExperience}+</StatValue>
                <StatLabel>Years Experience</StatLabel>
              </Stat>
              {hasProjects && (
                <Stat>
                  <StatValue>{contentData.projects.length}+</StatValue>
                  <StatLabel>Projects Completed</StatLabel>
                </Stat>
              )}
              {contentData.technologies?.items?.length > 0 && (
                <Stat>
                  <StatValue>{contentData.technologies.items.length}+</StatValue>
                  <StatLabel>Technologies</StatLabel>
                </Stat>
              )}
            </Stats>
          </motion.div>
        </HeroContainer>
      </Section>

      {/* Projects Section */}
      {hasProjects && (
        <Section data-section="projects">
          <Projects />
        </Section>
      )}

      {/* Experience Section */}
      {hasExperience && (
        <Section data-section="experience">
          <Experience />
        </Section>
      )}

      {/* Hobbies Section */}
      {hasHobbies && (
        <Section data-section="hobbies">
          <Hobbies />
        </Section>
      )}

      {/* Contact Section */}
      {hasContact && (
        <Section data-section="contact">
          <Contact />
        </Section>
      )}
    </PageContainer>
    </>
  );
});

export default Home;
