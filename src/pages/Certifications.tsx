import { contentData } from '@data/content';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { memo } from 'react';
import styled from 'styled-components';

const CertificationsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const CertificationsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CertificationCard = styled(motion.a)`
  background-color: ${({ theme }) => `${theme.colors.card}e6`};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  padding: 2rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  text-decoration: none;
  display: block;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.foreground} 0%,
      ${({ theme }) => theme.colors.accent} 100%
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.foreground};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-4px);

    &::before {
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.foreground} 0%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.background};
`;

const CardContent = styled.div`
  flex: 1;
`;

const CertificationTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.foreground};
  line-height: 1.4;
`;

const DateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ViewLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
  transition: gap ${({ theme }) => theme.transitions.fast};

  ${CertificationCard}:hover & {
    gap: 0.75rem;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Certifications = memo(() => {
  const { certifications } = contentData;

  // Only render if certifications exist
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <CertificationsContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Certifications
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Professional certifications and achievements
        </Subtitle>
      </Header>

      <CertificationsGrid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {certifications.filter(cert => cert.enabled !== false).map((cert, index) => (
          <CertificationCard
            key={index}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            tabIndex={0}
            role="article"
            aria-label={`${cert.title} certification`}
          >
            <CardHeader>
              <IconWrapper>
                <Award size={24} />
              </IconWrapper>
              <CardContent>
                <CertificationTitle>{cert.title}</CertificationTitle>
                <DateBadge>
                  <Calendar size={14} />
                  {cert.date}
                </DateBadge>
              </CardContent>
            </CardHeader>
            <ViewLink>
              View Certificate
              <ExternalLink size={16} />
            </ViewLink>
          </CertificationCard>
        ))}
      </CertificationsGrid>
    </CertificationsContainer>
  );
});

Certifications.displayName = 'Certifications';

export default Certifications;
