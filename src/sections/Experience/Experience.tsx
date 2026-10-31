import { Scrub } from '@components/motion/Scrub';
import { SectionHeading } from '@components/ui/SectionHeading';
import { contentData } from '@data/content';
import { calculateDuration, formatDateRange } from '@utils/dates';
import { groupExperience } from '@utils/groupExperience';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Tenure = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 1.5rem clamp(2rem, 5vw, 5rem);
  padding: clamp(2.5rem, 5vw, 4rem) 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const TenureHeader = styled.div`
  @media (min-width: 769px) {
    position: sticky;
    top: 6rem;
    align-self: start;
  }
`;

const CurrentLabel = styled.span`
  display: block;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CompanyName = styled.h3`
  margin: 0 0 0.75rem;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.75rem, 2.6vw, 2.6rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
`;

const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.6rem;
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const RoleList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const RoleTitle = styled.h4`
  margin: 0 0 0.3rem;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const RoleMeta = styled(Meta)`
  margin-bottom: 1rem;
  font-size: 0.85rem;
`;

const Bullets = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-width: 62ch;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Bullet = styled.li`
  position: relative;
  padding-left: 1.4rem;
  font-size: 1.0625rem;
  line-height: 1.65;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.8em;
    width: 0.65rem;
    height: 1px;
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const StackLine = styled.li`
  margin-top: 0.25rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Separator = () => <span aria-hidden="true">·</span>;

const isPresent = (date: string) => date.toLowerCase() === 'present';

const Experience = () => {
  const tenures = groupExperience(contentData.experience);
  const { education, sections } = contentData;

  return (
    <Container>
      <SectionHeading title={sections.experience.title} />

      {tenures.map((tenure) => {
        const hasLadder = tenure.roles.length > 1;
        return (
          <Scrub key={`${tenure.company}-${tenure.startDate}`} distance={50}>
            <Tenure>
              <TenureHeader>
                {isPresent(tenure.endDate) && (
                  <CurrentLabel>Current</CurrentLabel>
                )}
                <CompanyName>{tenure.company}</CompanyName>
                <Meta>
                  <span>{tenure.city}</span>
                  <Separator />
                  <span>
                    {formatDateRange(tenure.startDate, tenure.endDate)}
                  </span>
                  <Separator />
                  <span>
                    {calculateDuration(tenure.startDate, tenure.endDate)}
                  </span>
                </Meta>
              </TenureHeader>
              <RoleList>
                {tenure.roles.map((role) => (
                  <li key={role.startDate}>
                    <RoleTitle>{role.position}</RoleTitle>
                    {hasLadder && (
                      <RoleMeta>
                        <span>
                          {formatDateRange(role.startDate, role.endDate)}
                        </span>
                        <Separator />
                        <span>
                          {calculateDuration(role.startDate, role.endDate)}
                        </span>
                      </RoleMeta>
                    )}
                    <Bullets>
                      {role.responsibilities.map((line) =>
                        line.startsWith('Stack:') ? (
                          <StackLine key={line}>{line}</StackLine>
                        ) : (
                          <Bullet key={line}>{line}</Bullet>
                        ),
                      )}
                    </Bullets>
                  </li>
                ))}
              </RoleList>
            </Tenure>
          </Scrub>
        );
      })}

      {education.length > 0 && (
        <Scrub distance={50}>
          <Tenure as="section" aria-labelledby="education">
            <TenureHeader>
              <CompanyName as="h3" id="education">
                Education
              </CompanyName>
            </TenureHeader>
            <RoleList as="ul">
              {education.map((degree) => (
                <li key={degree.position}>
                  <RoleTitle as="p">{degree.position}</RoleTitle>
                  <Meta>
                    <span>{degree.company}</span>
                    <Separator />
                    <span>{degree.city}</span>
                    <Separator />
                    <span>{degree.period}</span>
                  </Meta>
                </li>
              ))}
            </RoleList>
          </Tenure>
        </Scrub>
      )}
    </Container>
  );
};

export default Experience;
