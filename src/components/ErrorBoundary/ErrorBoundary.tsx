import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from 'styled-components';

const ISSUES_URL = 'https://github.com/SilviuDinu/portfolio-app/issues/new';

const ErrorScreen = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
`;

const ErrorCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 40rem;
`;

const ErrorTitle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
`;

const ErrorText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};

  a {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const ErrorDetail = styled.pre`
  margin: 0;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RefreshButton = styled.button`
  align-self: flex-start;
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 3px;
  }
`;

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <ErrorScreen role="alert">
        <ErrorCard>
          <ErrorTitle>Something went wrong.</ErrorTitle>
          <ErrorText>
            Refreshing usually fixes it. If it keeps happening,{' '}
            <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
              open an issue
            </a>{' '}
            and paste the details below.
          </ErrorText>
          <ErrorDetail>{error.message}</ErrorDetail>
          <RefreshButton onClick={() => window.location.reload()}>
            Refresh page
          </RefreshButton>
        </ErrorCard>
      </ErrorScreen>
    );
  }
}

export default ErrorBoundary;
