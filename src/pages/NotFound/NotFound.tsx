import { Header } from '@components/Header/Header';
import { LineButton } from '@components/ui/LineButton';
import { fadeUp, stagger } from '@styles/motion';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import styled from 'styled-components';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Centre = styled(motion.main)`
  flex: 1;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1.25rem;
  padding: 4rem 1.5rem 6rem;
  text-align: center;
`;

const Kicker = styled(motion.p)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Code = styled(motion.h1)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(7rem, 22vw, 17rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
`;

const Line = styled(motion.p)`
  max-width: 28ch;
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.4rem, 2.6vw, 2.1rem);
  line-height: 1.2;
`;

const Way = styled(motion.div)`
  margin-top: 1.5rem;
`;

const NotFound = () => (
  <Page>
    <Header
      sections={[{ id: 'home', label: 'Home', icon: Home }]}
      onNavigate={() => window.location.assign('/')}
    />
    <Centre variants={stagger()} initial="hidden" animate="visible">
      <Kicker variants={fadeUp}>Not found</Kicker>
      <Code variants={fadeUp}>404</Code>
      <Line variants={fadeUp}>
        There is nothing at this address. It may have moved, or never been.
      </Line>
      <Way variants={fadeUp}>
        <LineButton as="a" href="/">
          <Home size={14} />
          Back to the start
        </LineButton>
      </Way>
    </Centre>
  </Page>
);

export default NotFound;
