import { contentData } from '@data/content';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ExternalLink, Gamepad2, Zap } from 'lucide-react';
import { memo, useState } from 'react';
import styled from 'styled-components';

const HobbiesContainer = styled.div`
  max-width: 1400px;
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
  margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: clamp(0.625rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem);
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.foreground : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background : theme.colors.foreground};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: clamp(0.8125rem, 2vw, 1rem);
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: center;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.foreground};
  }

  svg {
    width: clamp(16px, 3vw, 20px);
    height: clamp(16px, 3vw, 20px);
  }
`;

// Photography Styles
const PhotoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
`;

const PhotoCard = styled(motion.a)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  display: block;

  &:hover img {
    transform: scale(1.1);
  }

  &:hover::after {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};
`;

const PhotoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(1rem, 3vw, 1.5rem);
  z-index: 1;
  opacity: 0;
  transform: translateY(10px);
  transition: all ${({ theme }) => theme.transitions.normal};

  ${PhotoCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PhotoAlt = styled.p`
  color: white;
  font-size: clamp(0.8125rem, 2vw, 0.875rem);
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PhotoLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  font-size: clamp(0.6875rem, 1.5vw, 0.75rem);
  opacity: 0.9;
`;

// Games Styles
const GamesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
`;

const GameCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background-color: ${({ theme }) => `${theme.colors.card}e6`};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.foreground};
  }
`;

const GameIconWrapper = styled.div`
  width: clamp(60px, 15vw, 80px);
  height: clamp(60px, 15vw, 80px);
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const GameTitle = styled.h3`
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.foreground};
`;

// Speed Skating Styles
const SpeedSkatingContainer = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
`;

const SpeedSkatingCard = styled(motion.div)`
  background-color: ${({ theme }) => `${theme.colors.card}e6`};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: 768px) {
    border-radius: 0.75rem;
  }
`;

const SpeedSkatingImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const SpeedSkatingContent = styled.div`
  padding: clamp(1.5rem, 4vw, 2.5rem);
`;

const SpeedSkatingTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  color: ${({ theme }) => theme.colors.foreground};
`;

const SpeedSkatingParagraph = styled.p`
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    line-height: 1.6;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

type HobbyTab = 'photography' | 'games' | 'speedSkating';

// Helper to find game icon with fallback extensions
const getGameIconPath = (iconName: string): string => {
  // If icon already has extension, use it
  if (iconName.match(/\.(svg|png|jpg|jpeg)$/i)) {
    // Check if it's in icons folder first
    return `/src/assets/icons/${iconName}`; // Browser will try to load, fallback handled by onerror
  }

  // Try svg first, then png, then jpg in icons folder
  return `/src/assets/icons/${iconName}.svg`;
};

const getGameIconFallback = (iconName: string): string[] => {
  const baseName = iconName.replace(/\.(svg|png|jpg|jpeg)$/i, '');
  return [
    `/src/assets/icons/${baseName}.svg`,
    `/src/assets/icons/${baseName}.png`,
    `/src/assets/icons/${baseName}.jpg`,
    `/src/assets/images/${baseName}.svg`,
    `/src/assets/images/${baseName}.png`,
    `/src/assets/images/${baseName}.jpg`,
  ];
};

const Hobbies = memo(() => {
  const { photography, games, speedSkating } = contentData;

  // Check what content exists
  const hasPhotography = photography && photography.length > 0;
  const hasGames = games && games.length > 0;
  const hasSpeedSkating = speedSkating && speedSkating.title;

  // Set default tab based on what exists
  const defaultTab = hasSpeedSkating
    ? 'speedSkating'
    : hasPhotography
      ? 'photography'
      : 'games';
  const [activeTab, setActiveTab] = useState<HobbyTab>(defaultTab);

  // If none exists, don't render
  if (!hasPhotography && !hasGames && !hasSpeedSkating) {
    return null;
  }

  return (
    <HobbiesContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Hobbies
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          When I'm not coding, I enjoy speed skating, capturing moments through
          photography, and exploring virtual worlds
        </Subtitle>

        <TabsContainer>
          {hasSpeedSkating && (
            <Tab
              $active={activeTab === 'speedSkating'}
              onClick={() => setActiveTab('speedSkating')}
            >
              <Zap size={20} />
              Speed Skating
            </Tab>
          )}
          {hasPhotography && (
            <Tab
              $active={activeTab === 'photography'}
              onClick={() => setActiveTab('photography')}
            >
              <Camera size={20} />
              Photography
            </Tab>
          )}
          {hasGames && (
            <Tab
              $active={activeTab === 'games'}
              onClick={() => setActiveTab('games')}
            >
              <Gamepad2 size={20} />
              Gaming
            </Tab>
          )}
        </TabsContainer>
      </Header>

      <AnimatePresence mode="wait">
        {activeTab === 'speedSkating' && hasSpeedSkating && (
          <SpeedSkatingContainer
            key="speedSkating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SpeedSkatingCard>
              <SpeedSkatingImage
                src={`/src/assets/images/${speedSkating.image.path}`}
                alt={speedSkating.image.alt}
                loading="lazy"
              />
              <SpeedSkatingContent>
                <SpeedSkatingTitle>{speedSkating.title}</SpeedSkatingTitle>
                {speedSkating.description.map((paragraph, index) => (
                  <SpeedSkatingParagraph key={index}>
                    {paragraph}
                  </SpeedSkatingParagraph>
                ))}
              </SpeedSkatingContent>
            </SpeedSkatingCard>
          </SpeedSkatingContainer>
        )}
        {activeTab === 'photography' && hasPhotography && (
          <PhotoGrid
            key="photography"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {photography.filter(photo => photo.enabled !== false).map((photo, index) => (
              <PhotoCard
                key={index}
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
              >
                <PhotoImage
                  src={photo.altUrl ?? `/src/assets/images/${photo.path}`}
                  alt={photo.alt}
                  loading="lazy"
                />
                <PhotoOverlay>
                  <PhotoAlt>{photo.alt}</PhotoAlt>
                  <PhotoLink>
                    <ExternalLink size={12} />
                    View on Unsplash
                  </PhotoLink>
                </PhotoOverlay>
              </PhotoCard>
            ))}
          </PhotoGrid>
        )}
        {activeTab === 'games' && hasGames && (
          <GamesGrid
            key="games"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {games.filter(game => game.enabled !== false).map((game, index) => {
              const fallbackPaths = getGameIconFallback(game.icon);
              return (
                <GameCard
                  key={index}
                  variants={itemVariants}
                >
                  <GameIconWrapper>
                    <img
                      src={getGameIconPath(game.icon)}
                      alt={game.title}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        const currentSrc = img.src;
                        const currentIndex = fallbackPaths.findIndex((path) =>
                          currentSrc.includes(path.replace('/src/assets/', '')),
                        );
                        if (currentIndex < fallbackPaths.length - 1) {
                          img.src = fallbackPaths[currentIndex + 1];
                        }
                      }}
                    />
                  </GameIconWrapper>
                  <GameTitle>{game.title}</GameTitle>
                </GameCard>
              );
            })}
          </GamesGrid>
        )}
      </AnimatePresence>
    </HobbiesContainer>
  );
});

Hobbies.displayName = 'Hobbies';

export default Hobbies;
