import type { Section } from '@pages/Home/sections';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import styled from 'styled-components';

const DRAWER_SPRING = { type: 'spring', damping: 25, stiffness: 200 } as const;

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
`;

const Drawer = styled(motion.div)`
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

const DrawerLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
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

const DrawerActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface MobileMenuProps {
  open: boolean;
  sections: Section[];
  onNavigate: (sectionId: string) => void;
  onClose: () => void;
  children: ReactNode;
}

export const MobileMenu = ({
  open,
  sections,
  onNavigate,
  onClose,
  children,
}: MobileMenuProps) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Drawer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={DRAWER_SPRING}
          >
            <CloseButton onClick={onClose} aria-label="Close menu">
              <X size={24} />
            </CloseButton>
            {sections.map(({ id, label, icon: Icon }) => (
              <DrawerLink key={id} onClick={() => onNavigate(id)}>
                <Icon size={20} />
                {label}
              </DrawerLink>
            ))}
            <DrawerActions>{children}</DrawerActions>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
};
