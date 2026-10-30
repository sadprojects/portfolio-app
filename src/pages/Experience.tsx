import { SectionHeading } from '@components/SectionHeading';
import { Scrub } from '@components/motion/Scrub';
import { contentData } from '@data/content';
import { calculateDuration, formatDateRange } from '@utils/dateUtils';
import { groupExperience } from '@utils/experience';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { lift, stagger } from '@styles/motion';
import styled from 'styled-components';

const ExperienceContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
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

const ExperienceCard = styled(motion.article)<{ $isCurrent?: boolean }>`
  position: relative;
  margin-bottom: 3rem;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: -3.0375rem;
    top: 2.5rem;
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

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const CardContent = styled.div`
  background-color: ${({ theme }) => `${theme.colors.card}e6`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  padding: 2rem;
  outline: none;
  ${lift}

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CompanyHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem 1.5rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CompanyName = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.1;
  margin: 0 0 0.5rem;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Pill = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.accent};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const CurrentPill = styled(Pill)`
  background: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  border-color: ${({ theme }) => theme.colors.foreground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* Roles inside one company. With more than one role they stack on a small ladder. */
const Roles = styled.ol<{ $ladder: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  ${({ $ladder, theme }) =>
    $ladder &&
    `
    padding-left: 1.75rem;

    &::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 0.75rem;
      bottom: 0.75rem;
      width: 2px;
      background: ${theme.colors.border};
    }
  `}
`;

const Role = styled.li<{ $ladder: boolean; $current: boolean }>`
  position: relative;

  ${({ $ladder, $current, theme }) =>
    $ladder &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -1.75rem;
      top: 0.45rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${$current ? theme.colors.foreground : theme.colors.border};
      border: 2px solid ${theme.colors.card};
      box-sizing: border-box;
    }
  `}
`;

const RoleHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-bottom: 0.4rem;
`;

const RoleTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const RoleMeta = styled(Meta)`
  margin-bottom: 0.75rem;
`;

const Responsibilities = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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

const isPresent = (date: string) => date.toLowerCase() === 'present';

const Experience = () => {
  const tenures = groupExperience(contentData.experience);

  if (tenures.length === 0) {
    return null;
  }

  return (
    <ExperienceContainer>
      <SectionHeading title="Experience" />

      <Timeline>
        <motion.div variants={stagger(0.15)} initial="hidden" animate="visible">
          {tenures.map((tenure) => {
            const current = isPresent(tenure.endDate);
            const ladder = tenure.roles.length > 1;

            return (
              <ExperienceCard
                key={`${tenure.company}-${tenure.startDate}`}
                $isCurrent={current}
              >
                <Scrub>
                  <CardContent
                    tabIndex={0}
                    aria-label={`${tenure.roles[0].position} at ${tenure.company}`}
                  >
                    <CompanyHeader>
                      <div>
                        <CompanyName>{tenure.company}</CompanyName>
                        <Meta>
                          <MetaItem>
                            <MapPin size={14} />
                            {tenure.city}
                          </MetaItem>
                          <MetaItem>
                            <Calendar size={14} />
                            {formatDateRange(tenure.startDate, tenure.endDate)}
                          </MetaItem>
                        </Meta>
                      </div>
                      <Badges>
                        {current && <CurrentPill>Current</CurrentPill>}
                        <Pill>
                          {calculateDuration(tenure.startDate, tenure.endDate)}
                        </Pill>
                      </Badges>
                    </CompanyHeader>

                    <Roles $ladder={ladder}>
                      {tenure.roles.map((role) => (
                        <Role
                          key={role.startDate}
                          $ladder={ladder}
                          $current={isPresent(role.endDate)}
                        >
                          <RoleHeader>
                            <RoleTitle>{role.position}</RoleTitle>
                          </RoleHeader>
                          {ladder && (
                            <RoleMeta>
                              <span>
                                {formatDateRange(role.startDate, role.endDate)}
                              </span>
                              <span>
                                {calculateDuration(
                                  role.startDate,
                                  role.endDate,
                                )}
                              </span>
                            </RoleMeta>
                          )}
                          <Responsibilities>
                            {role.responsibilities.map((resp, i) => (
                              <Responsibility key={i}>{resp}</Responsibility>
                            ))}
                          </Responsibilities>
                        </Role>
                      ))}
                    </Roles>
                  </CardContent>
                </Scrub>
              </ExperienceCard>
            );
          })}
        </motion.div>
      </Timeline>
    </ExperienceContainer>
  );
};

export default Experience;
