import useClickOutside from '@hooks/useClickOutside';
import type { SectionConfig } from '@utils/sectionBuilder';
import { ChevronRight } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const TableOfContentsWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  right: ${({ $visible }) => $visible ? '2rem' : '-100%'};
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) and (min-width: 769px) {
    right: ${({ $visible }) => $visible ? '1rem' : '-100%'};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableOfContentsNav = styled.nav<{ $expanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1rem;
  background-color: ${({ theme }) => `${theme.colors.card}80`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  backdrop-filter: blur(24px) saturate(220%);
  -webkit-backdrop-filter: blur(24px) saturate(220%);
  box-shadow: ${({ theme }) => theme.shadows.lg};
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 1s forwards;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${({ theme }) => theme.colors.foreground};
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: ${({ $expanded }) => $expanded ? '1rem' : '0.75rem'};
  }
`;

const ToggleButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  left: -48px;
  top: 50%;
  transform: translateY(-50%) rotate(${({ $visible }) => $visible ? '180deg' : '0deg'});
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 1s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  &:hover {
    transform: translateY(-50%) rotate(${({ $visible }) => $visible ? '180deg' : '0deg'}) scale(1.1);
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    display: flex !important;
    position: fixed !important;
    left: auto !important;
    right: ${({ $visible }) => $visible ? 'calc(1rem + 280px - 48px)' : '1rem'} !important;
    top: 50% !important;
    transform: translateY(-50%) rotate(${({ $visible }) => $visible ? '0deg' : '180deg'}) !important;
    z-index: 1000 !important;
    opacity: 1 !important;
    animation: none !important;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
`;

const TocList = styled.div<{ $dragging: boolean; $expanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding-left: ${({ $expanded }) => $expanded ? '2.5rem' : '0'};
  justify-content: stretch;
  height: 100%;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    left: ${({ $expanded }) => $expanded ? '0.5rem' : 'calc(50% - 1px)'};
    top: 1rem;
    bottom: 1rem;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.foreground};
    cursor: ${({ $dragging }) => $dragging ? 'grabbing' : 'grab'};
    opacity: ${({ $expanded }) => $expanded ? '1' : '0'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }
`;

const TocButton = styled.button<{ $active: boolean; $draggable: boolean; $expanded: boolean }>`
  position: relative;
  background: none;
  border: none;
  cursor: ${({ $draggable, $active }) => $draggable && $active ? 'grab' : 'pointer'};
  padding: ${({ $expanded }) => $expanded ? '0.75rem 1rem' : '0.5rem'};
  display: flex;
  align-items: center;
  justify-content: ${({ $expanded }) => $expanded ? 'flex-start' : 'center'};
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.foreground};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.5rem;
  white-space: nowrap;
  overflow: visible;
  z-index: 3;

  svg {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    left: ${({ $expanded }) => $expanded ? 'calc(-2.5rem + 0.5rem - 3px)' : 'calc(50% - 4px)'};
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.foreground};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
    cursor: ${({ $draggable, $active }) => $draggable && $active ? 'grab' : 'pointer'};
    opacity: ${({ $expanded }) => $expanded ? '1' : '0'};
  }

  &:active::before {
    cursor: ${({ $draggable, $active }) => $draggable && $active ? 'grabbing' : 'pointer'};
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.background};
    background-color: ${({ theme }) => theme.colors.foreground};

    &::before {
      background-color: ${({ theme }) => theme.colors.foreground};
      transform: scale(2);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }

  ${({ $active, theme }) => $active && `
    background-color: ${theme.colors.foreground};
    color: ${theme.colors.background};

    &::before {
      background-color: ${theme.colors.foreground};
      transform: scale(2);
    }
  `}
`;

const TocLabel = styled.span<{ $expanded: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  display: ${({ $expanded }) => $expanded ? 'inline' : 'none'};
`;

interface TableOfContentsProps {
  sections: SectionConfig[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onDraggingChange?: (isDragging: boolean) => void;
  onExpandedChange?: (isExpanded: boolean) => void;
}

export const TableOfContents = memo(({ sections, activeSection, onNavigate, onDraggingChange, onExpandedChange }: TableOfContentsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(() => {
    // Start hidden on tablet, visible on desktop
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1024;
    }
    return true;
  });
  const [dragging, setDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [isTabletViewport, setIsTabletViewport] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 769 && window.innerWidth <= 1024;
    }
    return false;
  });
  const navRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Notify parent when expanded changes
  useEffect(() => {
    onExpandedChange?.(expanded && visible);
  }, [expanded, visible, onExpandedChange]);

  // Check if device is tablet
  const isTablet = useCallback(() => {
    return isTabletViewport;
  }, [isTabletViewport]);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      const newIsTablet = window.innerWidth >= 769 && window.innerWidth <= 1024;
      setIsTabletViewport(newIsTablet);

      // Reset visibility based on viewport
      if (window.innerWidth > 1024) {
        // Desktop: always visible, never expanded initially
        setVisible(true);
        setExpanded(false);
      } else if (newIsTablet) {
        // Tablet: hidden by default
        setVisible(false);
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close TOC when clicking outside on tablet
  useClickOutside(wrapperRef, useCallback((event) => {
    if (isTablet() && visible && toggleButtonRef.current && !toggleButtonRef.current.contains(event.target as Node)) {
      setVisible(false);
      setExpanded(false);
    }
  }, [visible, isTablet]));

  // Auto-expand on hover/focus (desktop only)
  const handleMouseEnter = useCallback(() => {
    if (!isTablet()) {
      setExpanded(true);
    }
  }, [isTablet]);

  const handleMouseLeave = useCallback(() => {
    if (!dragging && !isTablet()) {
      setExpanded(false);
    }
  }, [dragging, isTablet]);

  const handleToggleVisible = useCallback(() => {
    setVisible(prev => !prev);
    // On tablet, always expand when showing
    if (isTablet()) {
      setExpanded(prev => !prev);
    }
  }, [isTablet]);

  // Handle drag scrolling on the timeline
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!activeSection || !navRef.current) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragging(true);
    onDraggingChange?.(true);
    setDragStartY(clientY);
    e.preventDefault();
  }, [activeSection, onDraggingChange]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging || !navRef.current) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;

    // Calculate scroll ratio based on TOC height vs scrollable height
    const tocHeight = navRef.current.offsetHeight;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = scrollableHeight / tocHeight;

    // Apply ratio to deltaY for proportional scrolling, but clamp it
    const scrollAmount = deltaY * scrollRatio;
    const currentScroll = window.scrollY;
    const maxScroll = scrollableHeight;

    // Clamp the scroll to prevent overshooting
    const clampedScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount));
    window.scrollTo(0, clampedScroll);

    setDragStartY(clientY);
  }, [dragging, dragStartY]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
    onDraggingChange?.(false);

    // Trigger a scroll event after a short delay to resume snap behavior
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 100);
  }, [onDraggingChange]);;

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [dragging, handleDragMove, handleDragEnd]);

  const handleNavigate = useCallback((sectionId: string) => {
    onNavigate(sectionId);
    if (isTablet()) {
      setTimeout(() => {
        setExpanded(false);
        setVisible(false);
      }, 300);
    } else {
      setTimeout(() => setExpanded(false), 300);
    }
  }, [onNavigate, isTablet]);

  return (
    <>
      <ToggleButton
        ref={toggleButtonRef}
        $visible={visible}
        onClick={handleToggleVisible}
        aria-label={visible ? "Hide navigation" : "Show navigation"}
      >
        <ChevronRight size={20} />
      </ToggleButton>

      <TableOfContentsWrapper ref={wrapperRef} $visible={visible}>
        <TableOfContentsNav
          ref={navRef}
          $expanded={expanded}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
        <TocList $dragging={dragging} $expanded={expanded}>
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <TocButton
                key={section.id}
                $active={isActive}
                $draggable={isActive}
                $expanded={expanded}
                onClick={() => handleNavigate(section.id)}
                onMouseDown={isActive ? handleDragStart : undefined}
                onTouchStart={isActive ? handleDragStart : undefined}
                aria-label={`Go to ${section.label}`}
              >
                <Icon size={18} />
                <TocLabel $expanded={expanded}>{section.label}</TocLabel>
              </TocButton>
            );
          })}
        </TocList>
      </TableOfContentsNav>
      </TableOfContentsWrapper>
    </>
  );
});

TableOfContents.displayName = 'TableOfContents';
