import { contentData } from '@data/content';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ExternalLink, Gamepad2 } from 'lucide-react';
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
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.foreground : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background : theme.colors.foreground};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.foreground};
  }
`;

// Photography Styles
const PhotoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
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
  padding: 1.5rem;
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
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PhotoLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  font-size: 0.75rem;
  opacity: 0.9;
`;

// Games Styles
const GamesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const GameCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
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
  width: 80px;
  height: 80px;
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
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.foreground};
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

type HobbyTab = 'photography' | 'games';

// Helper to find game icon with fallback extensions
const getGameIconPath = (iconName: string): string => {
  // If icon already has extension, use it
  if (iconName.match(/\.(svg|png|jpg|jpeg)$/i)) {
    // Check if it's in icons folder first
    const iconPath = `/src/assets/icons/${iconName}`;
    // Fallback to images folder
    const imagePath = `/src/assets/images/${iconName}`;
    return iconPath; // Browser will try to load, fallback handled by onerror
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
  const { photography, games } = contentData;

  // Check what content exists
  const hasPhotography = photography && photography.length > 0;
  const hasGames = games && games.length > 0;

  // If neither exists, don't render
  if (!hasPhotography && !hasGames) {
    return null;
  }

  // Set default tab based on what exists
  const defaultTab = hasPhotography ? 'photography' : 'games';
  const [activeTab, setActiveTab] = useState<HobbyTab>(defaultTab);

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
          When I'm not coding, I enjoy capturing moments through photography and exploring virtual worlds
        </Subtitle>

        <TabsContainer>
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
        {activeTab === 'photography' && hasPhotography && (
          <PhotoGrid
            key="photography"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {photography.map((photo, index) => (
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
            {games.map((game, index) => {
              const fallbackPaths = getGameIconFallback(game.icon);
              return (
                <GameCard key={index} variants={itemVariants}>
                  <GameIconWrapper>
                    <img
                      src={getGameIconPath(game.icon)}
                      alt={game.title}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        const currentSrc = img.src;
                        const currentIndex = fallbackPaths.findIndex(path => 
                          currentSrc.includes(path.replace('/src/assets/', ''))
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
