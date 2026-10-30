import { RevealMedia } from '@components/motion/RevealMedia';
import { RevealText } from '@components/motion/RevealText';
import { Scrub } from '@components/motion/Scrub';
import { contentData } from '@data/content';
import { LineButton } from '@pages/Home/HeroSection';
import { Grid, col } from '@styles/grid';
import { ExternalLink, FileText, Github } from 'lucide-react';
import { lazy, Suspense } from 'react';
import styled from 'styled-components';

const Sudoku = lazy(() => import('@components/Sudoku/Sudoku'));

const Block = styled(Grid).attrs({ as: 'article' })<{ $flip: boolean }>`
  align-items: center;
  grid-auto-flow: dense;
  row-gap: 1.75rem;
  padding: 0;

  & + & {
    margin-top: clamp(4rem, 10vw, 12rem);
  }
`;

const Media = styled.div<{ $flip: boolean }>`
  ${({ $flip }) => ($flip ? col('6 / 12', '6 / 13') : col('2 / 8', '1 / 8'))}
`;

const Text = styled.div<{ $flip: boolean }>`
  ${({ $flip }) => ($flip ? col('2 / 5', '1 / 6') : col('9 / 13', '8 / 13'))}
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Kicker = styled.p`
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Title = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.6rem, 2.4vw, 2.9rem);
  line-height: 1.1;
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Tools = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.75rem;
  margin-top: 0.5rem;
`;

/** The game sits in a half-width column, so stack its board over its controls. */
const GameSlot = styled(Scrub)`
  & > div {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Frame = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
`;

const ProjectMedia = ({ video, title }: { video: string; title: string }) => {
  if (video.includes('youtu')) {
    const id = video.includes('youtu.be')
      ? video.split('/').pop()?.split('?')[0]
      : new URLSearchParams(video.split('?')[1]).get('v');
    return (
      <Frame
        src={`https://www.youtube.com/embed/${id}`}
        title={`${title} video`}
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={`/media/videos/${video}.mp4`}
      poster={`/media/videos/${video}.gif`}
      muted
      loop
      autoPlay
      playsInline
      preload="metadata"
      aria-label={`${title} demo`}
    />
  );
};

const Projects = () => {
  const projects = contentData.projects.filter(
    (project) => project.enabled !== false,
  );

  if (projects.length === 0) return null;

  return (
    <div>
      {projects.map((project, index) => {
        const flip = index % 2 === 1;
        return (
          <Block key={project.title} $flip={flip} aria-label={project.title}>
            <Media $flip={flip}>
              {project.easterEgg === 'sudoku' || !project.video ? (
                <GameSlot>
                  <Suspense fallback={<Kicker>Loading game...</Kicker>}>
                    <Sudoku />
                  </Suspense>
                </GameSlot>
              ) : (
                <RevealMedia ratio="16 / 10" parallax={40}>
                  <ProjectMedia video={project.video} title={project.title} />
                </RevealMedia>
              )}
            </Media>
            <Text $flip={flip}>
              <Scrub>
                <Kicker>
                  {project.period} · {project.city}
                </Kicker>
                <Title text={project.title} tag="h3" exitOnScroll={false} />
                <Description>{project.description}</Description>
                <Tools>{project.tools.join(', ')}</Tools>
                <Links>
                  {project.website && project.website !== '#' && (
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
              </Scrub>
            </Text>
          </Block>
        );
      })}
    </div>
  );
};

export default Projects;
