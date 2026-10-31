import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Package, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import versionInfo from '@/version.json';

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const Dialog = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DialogTitle = styled.h2`
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

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 0.5rem;
`;

const InfoText = styled.div`
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

export const VersionModal = ({ isOpen, onClose }: VersionModalProps) => {
  const { buildTime } = versionInfo as { version: string; buildTime?: number };
  const builtAt = buildTime
    ? new Date(buildTime).toLocaleString(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : 'Not available';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Dialog
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle>Version Info</DialogTitle>
              <CloseButton onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </CloseButton>
            </DialogHeader>

            <DialogBody>
              <InfoRow>
                <InfoIcon>
                  <Package size={20} />
                </InfoIcon>
                <InfoText>
                  <InfoLabel>Current Version</InfoLabel>
                  <InfoValue>v{versionInfo.version}</InfoValue>
                </InfoText>
              </InfoRow>

              <InfoRow>
                <InfoIcon>
                  <Calendar size={20} />
                </InfoIcon>
                <InfoText>
                  <InfoLabel>Last Built</InfoLabel>
                  <InfoValue>{builtAt}</InfoValue>
                </InfoText>
              </InfoRow>
            </DialogBody>
          </Dialog>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  );
};
