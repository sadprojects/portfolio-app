import { RevealMedia } from '@components/motion/RevealMedia';
import { RevealText } from '@components/motion/RevealText';
import { Scrub } from '@components/motion/Scrub';
import { LineButton } from '@components/ui/LineButton';
import { contentData } from '@data/content';
import { Grid, col } from '@styles/grid';
import { ExternalLink, FileText, Github } from 'lucide-react';
import { lazy, Suspense } from 'react';
import styled from 'styled-components';

import { ProjectMedia } from './ProjectMedia';

const Sudoku = lazy(() => import('@components/Sudoku/Sudoku'));

const MEDIA_PARALLAX_PX = 40;

const ProjectRow = styled(Grid).attrs({ as: 'article' })`
  align-items: center;
  grid-auto-flow: dense;
  row-gap: 2rem;
  padding: 0;

  & + & {
    margin-top: clamp(5rem, 12vw, 14rem);
  }
`;

const MediaColumn = styled.div<{ $flip: boolean }>`
  ${({ $flip }) => ($flip ? col('6 / 12', '6 / 13') : col('2 / 8', '1 / 8'))}
  min-width: 0;
`;

const TextColumn = styled.div<{ $flip: boolean }>`
  ${({ $flip }) => ($flip ? col('2 / 5', '1 / 6') : col('9 / 13', '8 / 13'))}
  min-width: 0;
`;

const ProjectCopy = styled(Scrub)`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const RunningNumber = styled.span`
  position: absolute;
  top: -0.55em;
  left: -0.06em;
  z-index: -1;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(5rem, 9vw, 10rem);
  line-height: 1;
  opacity: 0.07;
  pointer-events: none;
  user-select: none;
`;

const Kicker = styled.p`
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ProjectTitle = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2rem, 3.4vw, 3.8rem);
  line-height: 1.02;
  letter-spacing: -0.015em;
`;

const Description = styled.p`
  max-width: 36ch;
  margin: 0;
  font-size: clamp(1.05rem, 1.25vw, 1.3rem);
  line-height: 1.55;
`;

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
`;

const Tag = styled.li`
  padding: 0.35rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.75rem;
  margin-top: 0.75rem;
`;

const GameSlot = styled(Scrub)`
  max-width: 32rem;
  margin: 0 auto;

  & > div {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Projects = () => {
  const { projects } = contentData;

  return (
    <div>
      {projects.map((project, position) => {
        const flip = position % 2 === 1;
        const showsGame = project.easterEgg === 'sudoku' || !project.video;
        return (
          <ProjectRow key={project.title} aria-label={project.title}>
            <MediaColumn $flip={flip}>
              {showsGame ? (
                <GameSlot>
                  <Suspense fallback={<Kicker>Loading game...</Kicker>}>
                    <Sudoku />
                  </Suspense>
                </GameSlot>
              ) : (
                <RevealMedia ratio="16 / 10" parallax={MEDIA_PARALLAX_PX}>
                  <ProjectMedia video={project.video!} title={project.title} />
                </RevealMedia>
              )}
            </MediaColumn>
            <TextColumn $flip={flip}>
              <ProjectCopy>
                <RunningNumber aria-hidden="true">
                  {String(position + 1).padStart(2, '0')}
                </RunningNumber>
                <Kicker>
                  {project.period} · {project.city}
                </Kicker>
                <ProjectTitle
                  text={project.title}
                  tag="h3"
                  exitOnScroll={false}
                />
                <Description>{project.description}</Description>
                <Tags aria-label="Built with">
                  {project.tools.map((tool) => (
                    <Tag key={tool}>{tool}</Tag>
                  ))}
                </Tags>
                <Links>
                  {project.website && (
                    <LineButton
                      as="a"
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                      Website
                    </LineButton>
                  )}
                  {project.publication && (
                    <LineButton
                      as="a"
                      href={project.publication}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText size={14} />
                      Paper
                    </LineButton>
                  )}
                  <LineButton
                    as="a"
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code`}
                  >
                    <Github size={14} />
                    Code
                  </LineButton>
                </Links>
              </ProjectCopy>
            </TextColumn>
          </ProjectRow>
        );
      })}
    </div>
  );
};

export default Projects;
