import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { Footer } from '@components/Footer/Footer';
import { Loader } from '@components/Loader/Loader';
import { Toast } from '@components/Toast/Toast';
import { useAccessibility } from '@contexts/AccessibilityContext';
import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle, useTheme } from 'styled-components';

// Lazy load Snowfall since it's only used conditionally
const Snowfall = lazy(() => import('react-snowfall'));

// Lazy load pages
const Home = lazy(() => import('@pages/Home'));
const NotFound = lazy(() => import('@pages/NotFound'));

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    background-color: ${({ theme }) => theme.colors.background};
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
  transition:
    background-color ${({ theme }) => theme.transitions.normal},
    color ${({ theme }) => theme.transitions.normal};
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const SnowLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
`;

const AppContent = () => {
  const { snowfallEnabled, toast, hideToast } = useAccessibility();
  const theme = useTheme();
  const [showSnow, setShowSnow] = useState(false);

  // Delay snow start by 4 seconds after page load
  useEffect(() => {
    if (snowfallEnabled) {
      const timer = setTimeout(() => {
        setShowSnow(true);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowSnow(false);
    }
  }, [snowfallEnabled]);

  // Snow is white/bright in dark mode, soft blue in light mode
  const isDarkMode = theme.colors.background === '#000000';
  const snowColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(100, 149, 237, 0.8)';

  return (
    <AppContainer>
      {showSnow && (
        <SnowLayer>
          <Suspense fallback={null}>
            <Snowfall
              snowflakeCount={60}
              color={snowColor}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
          </Suspense>
        </SnowLayer>
      )}
      <MainContent>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/home"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />
            <Route
              path="/projects"
              element={
                <Navigate
                  to="/#projects"
                  replace
                />
              }
            />
            <Route
              path="/certifications"
              element={
                <Navigate
                  to="/#certifications"
                  replace
                />
              }
            />
            <Route
              path="/skills"
              element={
                <Navigate
                  to="/#skills"
                  replace
                />
              }
            />
            <Route
              path="/experience"
              element={
                <Navigate
                  to="/#experience"
                  replace
                />
              }
            />
            <Route
              path="/hobbies"
              element={
                <Navigate
                  to="/#hobbies"
                  replace
                />
              }
            />
            <Route
              path="/contact"
              element={
                <Navigate
                  to="/#contact"
                  replace
                />
              }
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </MainContent>
      <Footer />
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        icon={toast.icon}
        variant={toast.variant}
      />
    </AppContainer>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <GlobalStyle />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
};
