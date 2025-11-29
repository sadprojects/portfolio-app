import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { Footer } from '@components/Footer/Footer';
import { Loader } from '@components/Loader/Loader';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Lazy load pages
const Home = lazy(() => import('@pages/Home'));
const NotFound = lazy(() => import('@pages/NotFound'));

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  transition: background-color ${({ theme }) => theme.transitions.normal},
              color ${({ theme }) => theme.transitions.normal};
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

export const App = () => {
  return (
    <ErrorBoundary>
      <GlobalStyle />
      <BrowserRouter>
        <AppContainer>
          <MainContent>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainContent>
          <Footer />
        </AppContainer>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
