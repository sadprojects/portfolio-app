import { memo } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.foreground};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const Loader = memo(() => {
  return (
    <LoaderContainer>
      <Spinner />
      <LoadingText>Loading...</LoadingText>
    </LoaderContainer>
  );
});
