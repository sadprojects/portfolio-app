import type { SectionConfig } from '@utils/sectionBuilder';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.nav`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  opacity: 0;
  animation: tocIn 0.6s ease 1.2s forwards;

  @keyframes tocIn {
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1279px) {
    display: none;
  }
`;

const List = styled.div<{ $expanded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid
    ${({ theme, $expanded }) =>
      $expanded ? theme.colors.border : 'transparent'};
  border-radius: 1rem;
  background: ${({ theme, $expanded }) =>
    $expanded ? `${theme.colors.card}f2` : 'transparent'};
  backdrop-filter: ${({ $expanded }) => ($expanded ? 'blur(16px)' : 'none')};
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Item = styled.button<{ $active: boolean; $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0.5rem;
  border: 0;
  border-radius: 0.6rem;
  background: none;
  color: ${({ theme }) => theme.colors.foreground};
  font: inherit;
  font-size: 0.8rem;
  cursor: ${({ $active }) => ($active ? 'grab' : 'pointer')};
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.accent};
    outline: none;
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: ${({ $active }) => ($active ? 1 : 0.3)};
    transform: scale(${({ $active }) => ($active ? 1.4 : 1)});
    transition: all 0.3s ease;
  }

  span {
    display: ${({ $expanded }) => ($expanded ? 'inline' : 'none')};
  }
`;

interface TableOfContentsProps {
  sections: SectionConfig[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

/** Right-edge section dots (desktop only). Hover shows labels; drag the active dot to scrub the page. */
export const TableOfContents = ({
  sections,
  activeSection,
  onNavigate,
}: TableOfContentsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const lastY = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const startDrag = (event: React.MouseEvent) => {
    lastY.current = event.clientY;
    setDragging(true);
    event.preventDefault();
  };

  const onMove = useCallback((event: MouseEvent) => {
    const height = listRef.current?.offsetHeight || 1;
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollBy(0, ((event.clientY - lastY.current) * scrollable) / height);
    lastY.current = event.clientY;
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', stop);
    };
  }, [dragging, onMove]);

  return (
    <Wrapper
      aria-label="Sections"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => !dragging && setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
    >
      <List ref={listRef} $expanded={expanded}>
        {sections.map((section) => {
          const active = activeSection === section.id;
          return (
            <Item
              key={section.id}
              $active={active}
              $expanded={expanded}
              onClick={() => onNavigate(section.id)}
              onMouseDown={active ? startDrag : undefined}
              aria-label={`Go to ${section.label}`}
              aria-current={active ? 'true' : undefined}
            >
              <span>{section.label}</span>
            </Item>
          );
        })}
      </List>
    </Wrapper>
  );
};
