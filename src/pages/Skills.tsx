import { SectionHeading } from '@components/SectionHeading';
import { Scrub } from '@components/motion/Scrub';
import { contentData } from '@data/content';
import { useTilt } from '@hooks/useTilt';
import { lift, stagger } from '@styles/motion';
import { LayoutGroup, motion } from 'framer-motion';
import {
  ArrowUpRight,
  ExternalLink,
  Globe,
  Trophy,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

/* ---------- filter bar ---------- */
const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 2rem;
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
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background : theme.colors.secondary};
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  z-index: 1;

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.background : theme.colors.foreground};
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

/* ---------- skill tiles ---------- */
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
  gap: 1rem;
`;

const Tile = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  background: ${({ theme }) => `${theme.colors.card}e6`};
  transform-style: preserve-3d;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.foreground};
  }
`;

const Ring = styled.svg`
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 4;
  }
`;

const TileText = styled.div`
  min-width: 0;
`;

const SkillName = styled.div`
  font-weight: 700;
  line-height: 1.2;
`;

const SkillMeta = styled.div`
  margin-top: 0.2rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

/* ---------- credentials & strip ---------- */
const SubHeading = styled.h3`
  margin: 3.5rem 0 1.25rem;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  line-height: 1.1;
`;

const CredList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CredRow = styled.a`
  display: grid;
  grid-template-columns: 3.5rem 1fr auto;
  align-items: center;
  gap: 0.75rem 1.5rem;
  margin: 0 -1.25rem;
  padding: 1.75rem 1.25rem;
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

const CredIndex = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CredTitle = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.3rem, 2.2vw, 1.9rem);
  line-height: 1.15;
`;

const CredMeta = styled.span`
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CredAction = styled.span`
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

  ${CredRow}:hover & {
    color: ${({ theme }) => theme.colors.foreground};

    svg {
      transform: translate(3px, -3px);
    }
  }
`;

const Glance = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  margin-top: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  background: ${({ theme }) => `${theme.colors.card}e6`};
  overflow: hidden;
  ${lift}
`;

const GlanceCell = styled.div`
  padding: 1.5rem;

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

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  strong {
    display: block;
    font-family: ${({ theme }) => theme.typography.fonts.display};
    font-size: 1.9rem;
    line-height: 1.1;
  }

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StatLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface CodewarsData {
  honor: number;
  ranks: { overall: { name: string } };
  codeChallenges: { totalCompleted: number };
}

const ALL = 'All';

const SkillTile = ({
  name,
  level,
  category,
}: {
  name: string;
  level: number;
  category: string;
}) => {
  const tilt = useTilt(6);
  const r = 22;
  const circumference = 2 * Math.PI * r;
  return (
    <Tile layout {...tilt} aria-label={`${name}, ${level}%`}>
      <Ring viewBox="0 0 52 52" aria-hidden>
        <circle cx="26" cy="26" r={r} stroke="currentColor" opacity={0.15} />
        <motion.circle
          cx="26"
          cy="26"
          r={r}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - level / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </Ring>
      <TileText>
        <SkillName>{name}</SkillName>
        <SkillMeta>
          {category} · {level}%
        </SkillMeta>
      </TileText>
    </Tile>
  );
};

const Skills = () => {
  const { skills, certifications, codewars } = contentData;
  const [filter, setFilter] = useState(ALL);
  const [codewarsData, setCodewarsData] = useState<CodewarsData | null>(null);

  useEffect(() => {
    if (!codewars?.enabled || !codewars.username) return;
    fetch(`https://www.codewars.com/api/v1/users/${codewars.username}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setCodewarsData(data))
      .catch((error) => console.error('Failed to fetch Codewars data:', error));
  }, [codewars]);

  const professional = skills.professional.filter(
    (skill) => skill.enabled !== false,
  );
  const categories = [
    ALL,
    ...new Set(professional.map((skill) => skill.category)),
  ];
  const visible = professional
    .filter((skill) => filter === ALL || skill.category === filter)
    .sort((a, b) => b.level - a.level);
  const credentials = certifications.filter((cert) => cert.enabled !== false);

  return (
    <Container>
      <SectionHeading title="Skills & Credentials" />

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
                <ActivePill
                  layoutId="skills-filter"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              {category}
            </FilterButton>
          ))}
        </FilterBar>

        <Grid
          layout
          variants={stagger(0.05)}
          initial="hidden"
          animate="visible"
          key={filter}
        >
          {visible.map((skill) => (
            <Scrub key={skill.name}>
              <SkillTile {...skill} />
            </Scrub>
          ))}
        </Grid>
      </LayoutGroup>

      {credentials.length > 0 && (
        <>
          <SubHeading>Credentials</SubHeading>
          <CredList>
            {credentials.map((cert, i) => (
              <Scrub key={cert.url} distance={50}>
                <CredRow
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${cert.title}, view certificate`}
                >
                  <CredIndex>{String(i + 1).padStart(2, '0')}</CredIndex>
                  <span>
                    <CredTitle>{cert.title}</CredTitle>
                    <CredMeta>
                      {[cert.issuer, cert.date].filter(Boolean).join(' · ')}
                    </CredMeta>
                  </span>
                  <CredAction>
                    Open
                    <ArrowUpRight size={16} />
                  </CredAction>
                </CredRow>
              </Scrub>
            ))}
          </CredList>
        </>
      )}

      <Scrub>
        <Glance>
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
          {codewarsData && (
            <GlanceCell>
              <GlanceLabel>
                <Trophy size={14} />
                Codewars
              </GlanceLabel>
              <Stats>
                <Stat>
                  <strong>{codewarsData.ranks.overall.name}</strong>
                  <span>Rank</span>
                </Stat>
                <Stat>
                  <strong>{codewarsData.honor.toLocaleString()}</strong>
                  <span>Honor</span>
                </Stat>
                <Stat>
                  <strong>{codewarsData.codeChallenges.totalCompleted}</strong>
                  <span>Kata solved</span>
                </Stat>
              </Stats>
              <StatLink
                href={`https://www.codewars.com/users/${codewars.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
                <ExternalLink size={14} />
              </StatLink>
            </GlanceCell>
          )}
        </Glance>
      </Scrub>
    </Container>
  );
};

export default Skills;
