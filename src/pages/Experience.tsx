import { contentData } from '@data/content';
import { calculateDuration, formatDateRange } from '@utils/dateUtils';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { memo } from 'react';
import styled from 'styled-components';

const ExperienceContainer = styled.div`
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

const Timeline = styled.div`
  position: relative;
  padding-left: 3rem;

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};

    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const ExperienceCard = styled(motion.div)<{ $isCurrent?: boolean }>`
  position: relative;
  margin-bottom: 3rem;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: -3.0375rem;
    top: 50%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme, $isCurrent }) =>
      $isCurrent ? theme.colors.foreground : theme.colors.accent};
    border: 2px solid ${({ theme }) => theme.colors.background};
    z-index: 2;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: -3.1625rem;
    top: 49.3%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid
      ${({ theme, $isCurrent }) =>
        $isCurrent ? theme.colors.foreground : theme.colors.border};
    z-index: 1;

    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const CardContent = styled.div`
  background-color: ${({ theme }) => `${theme.colors.card}e6`};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  padding: 2rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  outline: none;

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.foreground};
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }
`;

const JobHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Company = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CompanyBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.border} 100%
  );
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Duration = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.75rem;
`;

const Responsibilities = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Responsibility = styled.li`
  position: relative;
  padding-left: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.6;

  &::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-weight: bold;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

const Experience = memo(() => {
  const { experience } = contentData;

  // Only render if experience exists
  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <ExperienceContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Work Experience
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          My professional journey and contributions
        </Subtitle>
      </Header>

      <Timeline>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {experience.filter(job => job.enabled !== false).map((job, index) => {
            const duration = calculateDuration(job.startDate, job.endDate);
            const dateRange = formatDateRange(job.startDate, job.endDate);
            const isCurrent = job.endDate.toLowerCase() === 'present';

            return (
              <ExperienceCard
                key={index}
                variants={itemVariants}
                $isCurrent={isCurrent}
              >
                <CardContent
                  tabIndex={0}
                  role="article"
                  aria-label={`${job.position} at ${job.company}`}
                >
                  <JobHeader>
                    <JobTitle>{job.position}</JobTitle>
                    <Company>
                      {job.company}
                      {isCurrent && <CompanyBadge>Current</CompanyBadge>}
                    </Company>
                  </JobHeader>

                  <JobMeta>
                    <MetaItem>
                      <Calendar size={16} />
                      {dateRange}
                    </MetaItem>
                    <MetaItem>
                      <MapPin size={16} />
                      {job.city}
                    </MetaItem>
                    <Duration>{duration}</Duration>
                  </JobMeta>

                  <Responsibilities>
                    {job.responsibilities.map((resp, i) => (
                      <Responsibility key={i}>{resp}</Responsibility>
                    ))}
                  </Responsibilities>
                </CardContent>
              </ExperienceCard>
            );
          })}
        </motion.div>
      </Timeline>
    </ExperienceContainer>
  );
});

export default Experience;
