import { Header } from '@components/Header/Header';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

import { Link } from 'react-router-dom';
import { fadeUp, stagger } from '@styles/motion';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const NotFoundContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Content = styled(motion.div)`
  text-align: center;
  max-width: 600px;
`;

const ErrorCode = styled(motion.h1)`
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.foreground} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Description = styled(motion.p)`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NotFound = () => {
  return (
    <PageWrapper>
      <Header
        sections={[
          { id: 'home', label: 'Home', icon: Home, enabled: true, order: 0 },
        ]}
        activeSection="home"
        onNavigate={() => {}}
      />
      <NotFoundContainer>
        <Content variants={stagger()} initial="hidden" animate="visible">
          <ErrorCode variants={fadeUp}>404</ErrorCode>

          <Title variants={fadeUp}>Page Not Found</Title>

          <Description variants={fadeUp}>
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </Description>

          <ButtonGroup variants={fadeUp}>
            <PrimaryButton to="/">
              <Home size={20} />
              Back to Home
            </PrimaryButton>
          </ButtonGroup>
        </Content>
      </NotFoundContainer>
    </PageWrapper>
  );
};

export default NotFound;
