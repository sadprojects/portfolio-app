import { Scrub } from '@components/motion/Scrub';
import { SectionHeading } from '@components/ui/SectionHeading';
import { contentData } from '@data/content';
import type { Skill } from '@data/types';
import { useTilt } from '@hooks/useTilt';
import { lift, stagger } from '@styles/motion';
import { LayoutGroup, motion } from 'framer-motion';
import { ArrowUpRight, Globe, Trophy, Wrench } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';

import { CodewarsStats } from './CodewarsStats';
import { useCodewars } from './useCodewars';

const ALL_SKILLS_FILTER = 'All';
const TILE_TILT_DEGREES = 6;
const PILL_SPRING = { type: 'spring', stiffness: 400, damping: 32 } as const;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 3.5rem;
  padding: 0.35rem;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => `${theme.colors.card}e6`};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 0.55rem 1.1rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.background : theme.colors.secondary)};
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  z-index: 1;

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.colors.background : theme.colors.foreground)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }
`;

const ActivePill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.foreground};
  z-index: -1;
`;

const SkillGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
  gap: 2.75rem;
`;

const Tile = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  background: ${({ theme }) => `${theme.colors.card}e6`};
  transform-style: preserve-3d;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.foreground};
  }
`;

const TileText = styled.div`
  min-width: 0;
`;

const SkillName = styled.div`
  font-weight: 700;
  line-height: 1.2;
`;

const SkillCategory = styled.div`
  margin-top: 0.2rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SkillLevel = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: 1.4rem;
  line-height: 1;
`;

const LevelBar = styled.span<{ $level: number }>`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0.8rem;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};

  &::after {
    content: '';
    display: block;
    width: ${({ $level }) => $level}%;
    height: 100%;
    background: ${({ theme }) => theme.colors.foreground};
  }
`;

const SubHeading = styled.h3`
  margin: 6rem 0 2.5rem;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  line-height: 1.1;
`;

const CredentialList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CredentialRow = styled.a`
  display: grid;
  grid-template-columns: 3.5rem 1fr auto;
  align-items: center;
  gap: 0.75rem 1.5rem;
  margin: 0 -1.25rem;
  padding: 2.75rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.75rem;
  color: inherit;
  text-decoration: none;
  ${lift}

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    border-color: transparent;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 2.5rem 1fr;
    margin: 0;
    padding: 1.5rem 0.5rem;

    > :last-child {
      grid-column: 2;
    }
  }
`;

const CredentialIndex = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CredentialTitle = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.3rem, 2.2vw, 1.9rem);
  line-height: 1.15;
`;

const CredentialMeta = styled.span`
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CredentialAction = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  white-space: nowrap;

  svg {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${CredentialRow}:hover & {
    color: ${({ theme }) => theme.colors.foreground};

    svg {
      transform: translate(3px, -3px);
    }
  }
`;

const AtAGlance = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  margin-top: 6rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  background: ${({ theme }) => `${theme.colors.card}e6`};
  overflow: hidden;
  ${lift}
`;

const GlanceCell = styled.div`
  padding: 2.5rem;

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 768px) {
    & + & {
      border-left: 0;
      border-top: 1px solid ${({ theme }) => theme.colors.border};
    }
  }
`;

const GlanceLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.span`
  padding: 0.35rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const SkillTile = ({ name, category, level }: Skill) => {
  const tilt = useTilt(TILE_TILT_DEGREES);
  return (
    <Tile layout {...tilt}>
      <TileText>
        <SkillName>{name}</SkillName>
        <SkillCategory>{category}</SkillCategory>
      </TileText>
      <SkillLevel>{level}%</SkillLevel>
      <LevelBar $level={level} aria-hidden="true" />
    </Tile>
  );
};

const Skills = () => {
  const { skills, certifications, codewars, sections } = contentData;
  const [filter, setFilter] = useState(ALL_SKILLS_FILTER);
  const codewarsProfile = useCodewars(codewars.username);

  const categories = [
    ALL_SKILLS_FILTER,
    ...new Set(skills.professional.map((skill) => skill.category)),
  ];
  const visibleSkills = skills.professional.filter(
    (skill) => filter === ALL_SKILLS_FILTER || skill.category === filter,
  );

  return (
    <Container>
      <SectionHeading title={sections.skills.title} />

      <LayoutGroup>
        <FilterBar role="tablist" aria-label="Filter skills by area">
          {categories.map((category) => (
            <FilterButton
              key={category}
              role="tab"
              aria-selected={filter === category}
              $active={filter === category}
              onClick={() => setFilter(category)}
            >
              {filter === category && (
                <ActivePill layoutId="skills-filter" transition={PILL_SPRING} />
              )}
              {category}
            </FilterButton>
          ))}
        </FilterBar>

        <SkillGrid
          layout
          variants={stagger(0.05)}
          initial="hidden"
          animate="visible"
          key={filter}
        >
          {visibleSkills.map((skill) => (
            <Scrub key={skill.name}>
              <SkillTile {...skill} />
            </Scrub>
          ))}
        </SkillGrid>
      </LayoutGroup>

      {certifications.length > 0 && (
        <>
          <SubHeading>Credentials</SubHeading>
          <CredentialList>
            {certifications.map((credential, position) => (
              <Scrub key={credential.url} distance={50}>
                <CredentialRow
                  href={credential.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${credential.title}, view certificate`}
                >
                  <CredentialIndex>
                    {String(position + 1).padStart(2, '0')}
                  </CredentialIndex>
                  <span>
                    <CredentialTitle>{credential.title}</CredentialTitle>
                    <CredentialMeta>
                      {[credential.issuer, credential.date]
                        .filter(Boolean)
                        .join(' · ')}
                    </CredentialMeta>
                  </span>
                  <CredentialAction>
                    Open
                    <ArrowUpRight size={16} />
                  </CredentialAction>
                </CredentialRow>
              </Scrub>
            ))}
          </CredentialList>
        </>
      )}

      <Scrub>
        <AtAGlance>
          {skills.developmentTools.length > 0 && (
            <GlanceCell>
              <GlanceLabel>
                <Wrench size={14} />
                Tooling
              </GlanceLabel>
              <Chips>
                {skills.developmentTools.map((tool) => (
                  <Chip key={tool}>{tool}</Chip>
                ))}
              </Chips>
            </GlanceCell>
          )}
          {skills.languages.length > 0 && (
            <GlanceCell>
              <GlanceLabel>
                <Globe size={14} />
                Languages
              </GlanceLabel>
              <Chips>
                {skills.languages.map((language) => (
                  <Chip key={language}>{language}</Chip>
                ))}
              </Chips>
            </GlanceCell>
          )}
          {codewarsProfile && (
            <GlanceCell>
              <GlanceLabel>
                <Trophy size={14} />
                Codewars
              </GlanceLabel>
              <CodewarsStats
                profile={codewarsProfile}
                username={codewars.username}
              />
            </GlanceCell>
          )}
        </AtAGlance>
      </Scrub>
    </Container>
  );
};

export default Skills;
