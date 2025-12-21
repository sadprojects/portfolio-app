import versionInfo from '@/version.json';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Package, X } from 'lucide-react';
import { memo } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 0.5rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
`;

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionModal = memo(({ isOpen, onClose }: VersionModalProps) => {
  // Format the build time (epoch ms) to user's local timezone
  const formatBuildDate = (epochMs: number | null | undefined): string => {
    if (!epochMs) return 'Not available';
    try {
      const date = new Date(epochMs);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Not available';
    }
  };

  const buildTime = (versionInfo as { version: string; buildTime?: number })
    .buildTime;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <Title>Version Info</Title>
              <CloseButton
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </CloseButton>
            </Header>

            <Content>
              <InfoItem>
                <IconWrapper>
                  <Package size={20} />
                </IconWrapper>
                <InfoContent>
                  <InfoLabel>Current Version</InfoLabel>
                  <InfoValue>v{versionInfo.version}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <IconWrapper>
                  <Calendar size={20} />
                </IconWrapper>
                <InfoContent>
                  <InfoLabel>Last Built</InfoLabel>
                  <InfoValue>{formatBuildDate(buildTime)}</InfoValue>
                </InfoContent>
              </InfoItem>
            </Content>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );

  // Render modal in a portal to ensure proper stacking
  return createPortal(modalContent, document.body);
});

VersionModal.displayName = 'VersionModal';
