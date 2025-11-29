import { contentData } from '@data/content';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, ExternalLink, Github, MapPin, Play } from 'lucide-react';
import { memo, useState } from 'react';
import styled from 'styled-components';

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
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

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2rem;
  grid-auto-rows: auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProjectCardWrapper = styled(motion.div)<{ $isExpanded: boolean; $expandedIndex: number | null; $currentIndex: number }>`
  ${({ $isExpanded, $expandedIndex, $currentIndex }) => {
    // Default column span in 6-column grid (each card spans 2 columns = 1/3 width)
    const defaultSpan = 2;
    const currentPosition = $currentIndex % 3;

    // If this card is expanded, take full row and stay in its original position
    if ($isExpanded) {
      const originalRow = Math.floor($currentIndex / 3);
      return `
        grid-column: 1 / -1;
        grid-row: ${originalRow + 1};
      `;
    }

    // If another card is expanded somewhere
    if ($expandedIndex !== null) {
      const expandedRow = Math.floor($expandedIndex / 3);
      const currentRow = Math.floor($currentIndex / 3);
      const expandedPosition = $expandedIndex % 3; // 0, 1, or 2

      // Cards in the same row as the expanded card - pushed to new row with 50/50 split
      if (expandedRow === currentRow) {
        const otherCardsInRow = [0, 1, 2].filter(pos => pos !== expandedPosition);
        const myIndexInOtherCards = otherCardsInRow.indexOf(currentPosition);

        // 50/50 split: first card spans columns 1-3, second card spans columns 4-6
        if (myIndexInOtherCards === 0) {
          return `
            grid-column: 1 / 4;
            grid-row: ${expandedRow + 2};
          `;
        } else {
          return `
            grid-column: 4 / 7;
            grid-row: ${expandedRow + 2};
          `;
        }
      }

      // Cards in rows after the expanded row need to shift down by 1
      if (currentRow > expandedRow) {
        const startCol = (currentPosition * defaultSpan) + 1;
        return `
          grid-column: ${startCol} / span ${defaultSpan};
          grid-row: ${currentRow + 2};
        `;
      }
    }

    // Default: normal grid positioning (span 2 columns in 6-column grid = 1/3 width)
    const startCol = (currentPosition * defaultSpan) + 1;
    return `
      grid-column: ${startCol} / span ${defaultSpan};
    `;
  }}

  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
  transition: grid-column 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              grid-row 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s ease,
              border-color 0.2s ease;
  cursor: ${({ $isExpanded }) => ($isExpanded ? 'default' : 'pointer')};

  /* Tablet: 2-column layout - disable complex grid logic */
  @media (max-width: 1024px) {
    grid-column: ${({ $isExpanded }) => $isExpanded ? '1 / -1' : 'auto'} !important;
    grid-row: auto !important;
    transition: none !important;
  }

  /* Mobile: single column layout - all cards full width */
  @media (max-width: 768px) {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
    transition: none !important;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }
`;const ProjectCardContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProjectTitleSection = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
`;

const IconButton = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
`;

const ExpandedContent = styled(motion.div)`
  padding: 0 2rem 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 1.5rem;
  }
`;

const ExpandedGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const VideoSection = styled.div``;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const YouTubeEmbed = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DetailBlock = styled.div``;

const DetailTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.foreground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DetailTag = styled.span`
  padding: 0.5rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const LinksSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.foreground};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }
`;

const SecondaryLink = styled(LinkButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.foreground};
`;

const Projects = memo(() => {
  const { projects } = contentData;
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Only render if projects exist
  if (!projects || projects.length === 0) {
    return null;
  }

  const toggleExpand = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  const getVideoEmbed = (video: string) => {
    // Check if it's a YouTube URL
    if (video.includes('youtube.com') || video.includes('youtu.be')) {
      const videoId = video.includes('youtu.be')
        ? video.split('/').pop()?.split('?')[0]
        : new URLSearchParams(video.split('?')[1]).get('v');

      return (
        <YouTubeEmbed
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Project video"
        />
      );
    }

    // Check if it's a local video file
    if (!video.startsWith('http')) {
      try {
        return (
          <Video controls>
            <source src={`/src/assets/videos/${video}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>
        );
      } catch {
        return (
          <VideoPlaceholder>
            <Play size={48} />
            <span>Video not available</span>
          </VideoPlaceholder>
        );
      }
    }

    // External video URL
    return (
      <Video controls>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    );
  };

  return (
    <ProjectsContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A collection of projects showcasing my skills and passion for development
        </Subtitle>
      </Header>

      <ProjectsGrid>
        {projects.map((project, index) => {
          const isExpanded = expandedId === index;

          return (
            <ProjectCardWrapper
              key={index}
              $isExpanded={isExpanded}
              $expandedIndex={expandedId}
              $currentIndex={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProjectCardContent onClick={() => !isExpanded && toggleExpand(index)}>
                <ProjectHeader>
                  <ProjectTitleSection>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectMeta>
                      <MetaItem>
                        <Calendar size={12} />
                        {project.period}
                      </MetaItem>
                      <MetaItem>
                        <MapPin size={12} />
                        {project.city}
                      </MetaItem>
                    </ProjectMeta>
                  </ProjectTitleSection>
                  <ProjectActions>
                    {project.website && (
                      <IconButton
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Visit ${project.title} website`}
                      >
                        <ExternalLink size={18} />
                      </IconButton>
                    )}
                    <IconButton
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View ${project.title} source code`}
                    >
                      <Github size={18} />
                    </IconButton>
                    <ExpandButton
                      onClick={(e) => { e.stopPropagation(); toggleExpand(index); }}
                      aria-label={isExpanded ? 'Collapse project details' : 'Expand project details'}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </ExpandButton>
                  </ProjectActions>
                </ProjectHeader>

                <Description>{project.description}</Description>

                {!isExpanded && (
                  <Tags>
                    {project.tools.slice(0, 6).map((tool, i) => (
                      <Tag key={i}>{tool}</Tag>
                    ))}
                    {project.tools.length > 6 && <Tag>+{project.tools.length - 6}</Tag>}
                  </Tags>
                )}
              </ProjectCardContent>

              <AnimatePresence>
                {isExpanded && (
                  <ExpandedContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExpandedGrid>
                      {project.video && (
                        <VideoSection>
                          <VideoContainer>
                            {getVideoEmbed(project.video)}
                          </VideoContainer>
                        </VideoSection>
                      )}

                      <DetailsSection>
                        <DetailBlock>
                          <DetailTitle>Technologies</DetailTitle>
                          <DetailTags>
                            {project.tools.map((tool, i) => (
                              <DetailTag key={i}>{tool}</DetailTag>
                            ))}
                          </DetailTags>
                        </DetailBlock>
                      </DetailsSection>
                    </ExpandedGrid>

                    <LinksSection>
                      {project.website && (
                        <LinkButton
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                          Visit Website
                        </LinkButton>
                      )}
                      <SecondaryLink
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} />
                        View Code
                      </SecondaryLink>
                    </LinksSection>
                  </ExpandedContent>
                )}
              </AnimatePresence>
            </ProjectCardWrapper>
          );
        })}
      </ProjectsGrid>
    </ProjectsContainer>
  );
});

Projects.displayName = 'Projects';

export default Projects;
