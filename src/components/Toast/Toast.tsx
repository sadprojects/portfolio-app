import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleOff, Info, X } from 'lucide-react';
import { memo, useEffect } from 'react';
import styled from 'styled-components';

type ToastVariant = 'enabled' | 'disabled' | 'info';

const ToastContainer = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.colors.foreground};
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 320px;
  max-width: calc(100vw - 2rem);

  @media (max-width: 768px) {
    bottom: 1rem;
    padding: 0.875rem 1.25rem;
    gap: 0.5rem;
    width: 280px;
  }
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
`;

const ToastMessage = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.background};
  flex: 1;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const DismissButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.background};
  opacity: 0.7;
  transition: opacity 150ms ease-in-out;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
`;

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  variant?: ToastVariant;
  duration?: number;
  icon?: React.ReactNode;
}

export const Toast = memo(
  ({
    message,
    isVisible,
    onClose,
    variant = 'info',
    duration = 4500,
    icon,
  }: ToastProps) => {
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose, duration]);

    const getDefaultIcon = () => {
      switch (variant) {
        case 'enabled':
          return <Check size={20} strokeWidth={2.5} />;
        case 'disabled':
          return <CircleOff size={20} />;
        case 'info':
        default:
          return <Info size={20} />;
      }
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <ToastContainer
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <ToastIcon>{icon || getDefaultIcon()}</ToastIcon>
            <ToastMessage>{message}</ToastMessage>
            <DismissButton
              onClick={onClose}
              aria-label="Dismiss notification"
            >
              <X size={18} />
            </DismissButton>
          </ToastContainer>
        )}
      </AnimatePresence>
    );
  },
);

Toast.displayName = 'Toast';
