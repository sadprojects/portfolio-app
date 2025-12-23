import { AlertTriangle, Check, Copy, RefreshCw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const ErrorGlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.background};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const ErrorCard = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  color: #ef4444;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StackTraceContainer = styled.div`
  margin-bottom: 2rem;
`;

const StackTraceLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const StackTrace = styled.pre`
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.foreground};
  max-height: 300px;
  overflow-y: auto;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    max-height: 200px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.foreground};

  &:hover {
    border-color: ${({ theme }) => theme.colors.foreground};
  }
`;

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.foreground};
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;



interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleCopy = async () => {
    const { error, errorInfo } = this.state;
    const errorText = `Error: ${error?.message || 'Unknown error'}\n\nStack Trace:\n${error?.stack || 'No stack trace available'}\n\nComponent Stack:${errorInfo?.componentStack || 'No component stack available'}`;

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy error to clipboard:', err);
    }
  };

  public render() {
    if (this.state.hasError) {
      const { error, errorInfo, copied } = this.state;
      const stackTrace = error?.stack || 'No stack trace available';

      // GitHub repository URL - update this to match your repository
      const issueUrl = `https://github.com/SilviuDinu/portfolio-app/issues/new?title=${encodeURIComponent(`Error: ${error?.message || 'Unknown error'}`)}&body=${encodeURIComponent(`## Error Report\n\n**Message:** ${error?.message || 'Unknown error'}\n\n**Stack Trace:**\n\`\`\`\n${stackTrace}\n\`\`\`\n\n**Component Stack:**\n\`\`\`${errorInfo?.componentStack || 'No component stack available'}\n\`\`\`\n\n**Browser:** ${navigator.userAgent}\n**Timestamp:** ${new Date().toISOString()}`)}`;

      return (
        <ErrorContainer>
          <ErrorGlobalStyle />
          <ErrorCard>
            <IconWrapper>
              <AlertTriangle size={32} />
            </IconWrapper>

            <Title>Oops! Something went wrong</Title>

            <Message>
              The application encountered an unexpected error. You can try refreshing the page or return to the home page.
              If the problem persists, please report this issue so I can fix it.
            </Message>

            <StackTraceContainer>
              <StackTraceLabel htmlFor="stack-trace">Error Details:</StackTraceLabel>
              <StackTrace id="stack-trace">
                {error?.message || 'Unknown error'}
                {'\n\n'}
                {stackTrace}
                {errorInfo?.componentStack && (
                  <>
                    {'\n\nComponent Stack:'}
                    {errorInfo.componentStack}
                  </>
                )}
              </StackTrace>
            </StackTraceContainer>

            <ButtonGroup>
              <MainButtons>
                <Button onClick={this.handleRefresh}>
                  <RefreshCw size={18} />
                  Refresh Page
                </Button>

                <SecondaryButton onClick={this.handleCopy}>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied' : 'Copy Error'}
                </SecondaryButton>
              </MainButtons>

              <ExternalLink
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AlertTriangle size={18} />
                Report Issue
              </ExternalLink>
            </ButtonGroup>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
