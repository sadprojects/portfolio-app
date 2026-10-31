import { useSnowfall } from '@contexts/SnowfallContext';
import { useTheme } from '@contexts/ThemeContext';
import type { Section } from '@pages/Home/sections';
import { motion } from 'framer-motion';
import { Menu, Moon, Snowflake, Sun } from 'lucide-react';
import { useState } from 'react';
import styled, { css } from 'styled-components';

import { MobileMenu } from './MobileMenu';
import { useHeaderVisibility } from './useHeaderVisibility';

const HeaderBar = styled(motion.header)`
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
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 4rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.1rem 1rem;
    min-height: 3rem;
  }
`;

const Logo = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.foreground};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  line-height: 1;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fonts.hand};
  font-size: 2.1rem;
  font-weight: 600;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const RightActions = styled.div`
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const iconButton = css`
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

const ThemeToggle = styled.button`
  ${iconButton}
`;

const struckThrough = css`
  opacity: 0.5;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 25%;
    width: 50%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.foreground};
    transform: rotate(-45deg);
  }
`;

const SnowToggle = styled.button<{ $off?: boolean }>`
  ${iconButton}
  ${({ $off }) => $off && struckThrough}
`;

const MobileMenuButton = styled.button`
  ${iconButton}
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const DesktopToggles = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HoverTriggerZone = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 99;
  pointer-events: ${({ $isActive }) => ($isActive ? 'auto' : 'none')};

  @media (max-width: 1024px) {
    display: none;
  }
`;

interface HeaderProps {
  sections?: Section[];
  onNavigate?: (sectionId: string) => void;
}

export const Header = ({ sections = [], onNavigate }: HeaderProps = {}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();
  const { enabled: snowing, toggle: toggleSnowfall } = useSnowfall();
  const visibility = useHeaderVisibility(menuOpen);

  const closeMenu = () => setMenuOpen(false);
  const navigate = (sectionId: string) => {
    onNavigate?.(sectionId);
    closeMenu();
  };

  const toggles = (
    <>
      <SnowToggle
        onClick={toggleSnowfall}
        aria-label={snowing ? 'Disable snowfall' : 'Enable snowfall'}
        title={snowing ? 'Snowfall: On' : 'Snowfall: Off'}
        $off={!snowing}
      >
        <Snowflake size={20} />
      </SnowToggle>
      <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
        {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </ThemeToggle>
    </>
  );

  return (
    <>
      <HoverTriggerZone
        $isActive={visibility.hidden}
        onMouseEnter={visibility.hoverIn}
      />
      <HeaderBar
        initial={{ y: 0 }}
        animate={{ y: visibility.visible ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={visibility.hoverIn}
        onMouseLeave={visibility.hoverOut}
        onFocus={visibility.show}
      >
        <Nav>
          <Logo
            onClick={() => onNavigate?.('home')}
            aria-label="Silviu Dinu, back to top"
          >
            Silviu Dinu
          </Logo>

          <RightActions>
            <DesktopToggles>{toggles}</DesktopToggles>
            <MobileMenuButton
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </MobileMenuButton>
          </RightActions>

          <MobileMenu
            open={menuOpen}
            sections={sections}
            onNavigate={navigate}
            onClose={closeMenu}
          >
            {toggles}
          </MobileMenu>
        </Nav>
      </HeaderBar>
    </>
  );
};
