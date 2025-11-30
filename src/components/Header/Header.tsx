import { useTheme } from '@contexts/ThemeContext';
import useClickOutside from '@hooks/useClickOutside';
import useDimensions from '@hooks/useDimensions';
import type { SectionConfig } from '@utils/sectionBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled(motion.header)`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => `${theme.colors.background}40`};
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.border}30`};
  backdrop-filter: blur(24px) saturate(220%);
  -webkit-backdrop-filter: blur(24px) saturate(220%);
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 768px) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Nav = styled.nav`
  margin: 0 auto;
  padding: .5rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 4rem;
  position: relative;
`;

const Logo = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.foreground};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  font-family: 'Scribble', cursive;
  font-weight: 400;
  font-style: normal;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoFirstName = styled.span`
  font-size: 2.75rem;

  @media (max-width: 768px) {
    font-size: 1.925rem; /* 30% smaller */
  }
`;

const LogoLastName = styled.span`
  font-size: 2.75rem;
  padding-left: 2rem;
  margin-top: -0.5rem;

  @media (max-width: 768px) {
    font-size: 1.925rem; /* 30% smaller */
    padding-left: 1.4rem; /* Proportionally smaller */
    margin-top: -0.35rem; /* Proportionally smaller */
  }
`;

const RightActions = styled.div`
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.foreground};
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.7;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.foreground};

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const DesktopThemeToggle = styled(ThemeToggle)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MobileNavLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 400;
  font-size: 1.25rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  text-align: left;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.foreground};
`;

const MobileActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface HeaderProps {
  sections?: SectionConfig[];
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  isTOCExpanded?: boolean;
}

export const Header = memo(({ sections = [], onNavigate, isTOCExpanded = false }: HeaderProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile] = useDimensions();
  const { mode, toggleTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  // Detect mobile/tablet viewport
  useEffect(() => {
    const checkViewport = () => {
      setIsTabletOrMobile(window.innerWidth <= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useClickOutside(navRef, closeMenu);

  const handleLogoClick = () => {
    const homeSection = document.querySelector('[data-section="home"]');
    if (homeSection) {
      navigate('/');
      onNavigate?.('home');
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    }
    closeMenu();
  };

  return (
    <>
      <HeaderContainer
        initial={{ y: 0 }}
        animate={{ y: (isVisible && !(isTabletOrMobile && isTOCExpanded)) ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
      <Nav>
        <Logo onClick={handleLogoClick} aria-label="Scroll to top">
          <LogoFirstName>Silviu</LogoFirstName>
          <LogoLastName>Dinu</LogoLastName>
        </Logo>

        <RightActions>
          <DesktopThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </DesktopThemeToggle>

          {isMobile && (
            <MobileMenuButton onClick={openMenu} aria-label="Open menu">
              <Menu size={24} />
            </MobileMenuButton>
          )}
        </RightActions>

        {isMobile && (
          <AnimatePresence>
            {isOpen && (
              <>
                <Overlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeMenu}
                />
                <MobileNav
                  ref={navRef}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <CloseButton onClick={closeMenu} aria-label="Close menu">
                    <X size={24} />
                  </CloseButton>

                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <MobileNavLink
                        key={section.id}
                        onClick={() => handleNavClick(section.id)}
                      >
                        <Icon size={20} />
                        {section.label}
                      </MobileNavLink>
                    );
                  })}

                  <MobileActions>
                    <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
                      {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </ThemeToggle>
                  </MobileActions>
                </MobileNav>
              </>
            )}
          </AnimatePresence>
        )}
      </Nav>
    </HeaderContainer>
    </>
  );
});
