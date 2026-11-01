import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { Footer } from '@components/Footer/Footer';
import { IntroLoader } from '@components/intro/IntroLoader';
import { IntroProvider, useIntro } from '@contexts/IntroContext';
import { SnowfallProvider, useSnowfall } from '@contexts/SnowfallContext';
import Home from '@pages/Home/Home';
import { SkipLink } from '@styles/a11y';
import { redirectLegacyPath } from '@utils/legacyRoutes';
import { Suspense, lazy } from 'react';
import styled, { createGlobalStyle, useTheme } from 'styled-components';

const Snowfall = lazy(() => import('react-snowfall'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));

const SNOWFLAKE_COUNT = 60;
const SNOW_COLOR = {
  dark: 'rgba(255, 255, 255, 0.9)',
  light: 'rgba(100, 149, 237, 0.8)',
};

const showsHome = redirectLegacyPath();

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    overflow-x: clip;
  }

  html,
  body {
    background-color: ${({ theme }) => theme.colors.background};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

const SnowLayer = () => {
  const theme = useTheme();
  return (
    <Suspense fallback={null}>
      <Snowfall
        snowflakeCount={SNOWFLAKE_COUNT}
        color={SNOW_COLOR[theme.mode]}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Suspense>
  );
};

const AppContent = () => {
  const { enabled: snowing } = useSnowfall();
  const { done: introDone } = useIntro();

  return (
    <AppContainer>
      {showsHome && <IntroLoader />}
      <SkipLink href="#main">Skip to content</SkipLink>
      {snowing && introDone && <SnowLayer />}
      <MainContent id="main" tabIndex={-1}>
        {showsHome ? (
          <Home />
        ) : (
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        )}
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

export const App = () => (
  <ErrorBoundary>
    <GlobalStyle />
    <IntroProvider skipped={!showsHome}>
      <SnowfallProvider>
        <AppContent />
      </SnowfallProvider>
    </IntroProvider>
  </ErrorBoundary>
);
