import { SectionHeading } from '@components/SectionHeading';
import { Scrub } from '@components/motion/Scrub';
import { contentData } from '@data/content';
import { stagger } from '@styles/motion';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Camera, ExternalLink, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin: -1.5rem auto 3rem;
  padding: 0.35rem;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => `${theme.colors.card}e6`};
`;

const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background : theme.colors.secondary};
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  z-index: 1;

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
  display: block;
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 40%,
      rgba(0, 0, 0, 0.75) 100%
    );
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: auto 0 0;
  padding: 1.25rem;
  z-index: 1;
  color: #fff;
  opacity: 0;
  transform: translateY(8px);
  transition: all ${({ theme }) => theme.transitions.normal};

  ${PhotoCard}:hover &,
  ${PhotoCard}:focus-visible & {
    opacity: 1;
    transform: translateY(0);
  }

  p {
    margin: 0 0 0.35rem;
    font-weight: 500;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    opacity: 0.85;
  }
`;

const GamesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
`;

const GameCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  background: ${({ theme }) => `${theme.colors.card}e6`};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.colors.foreground};
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  img {
    width: clamp(60px, 15vw, 90px);
    height: clamp(60px, 15vw, 90px);
    object-fit: cover;
    border-radius: 0.75rem;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }
`;

type HobbyTab = 'photography' | 'games';

const Hobbies = () => {
  const { photography, games } = contentData;
  const photos = photography.filter((photo) => photo.enabled !== false);
  const gameList = games.filter((game) => game.enabled !== false);
  const [tab, setTab] = useState<HobbyTab>(
    photos.length ? 'photography' : 'games',
  );

  if (!photos.length && !gameList.length) return null;

  const tabs: {
    id: HobbyTab;
    label: string;
    icon: typeof Camera;
    show: boolean;
  }[] = [
    {
      id: 'photography',
      label: 'Photography',
      icon: Camera,
      show: photos.length > 0,
    },
    { id: 'games', label: 'Gaming', icon: Gamepad2, show: gameList.length > 0 },
  ];

  return (
    <Container>
      <SectionHeading title="My Hobbies" center />

      <LayoutGroup>
        <Tabs role="tablist">
          {tabs
            .filter((t) => t.show)
            .map(({ id, label, icon: Icon }) => (
              <Tab
                key={id}
                role="tab"
                aria-selected={tab === id}
                $active={tab === id}
                onClick={() => setTab(id)}
              >
                {tab === id && (
                  <ActivePill
                    layoutId="hobby-tab"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={18} />
                {label}
              </Tab>
            ))}
        </Tabs>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        {tab === 'photography' && (
          <PhotoGrid
            key="photography"
            variants={stagger(0.05)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {photos.map((photo) => (
              <Scrub key={photo.path}>
                <PhotoCard
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${photo.alt}, view on Unsplash`}
                >
                  <PhotoImage
                    src={photo.altUrl ?? `/media/images/${photo.path}`}
                    alt={photo.alt}
                    loading="lazy"
                  />
                  <PhotoOverlay>
                    <p>{photo.alt}</p>
                    <span>
                      <ExternalLink size={12} />
                      View on Unsplash
                    </span>
                  </PhotoOverlay>
                </PhotoCard>
              </Scrub>
            ))}
          </PhotoGrid>
        )}
        {tab === 'games' && (
          <GamesGrid
            key="games"
            variants={stagger(0.05)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {gameList.map((game) => (
              <Scrub key={game.title}>
                <GameCard>
                  <img
                    src={`/media/images/${game.icon}`}
                    alt=""
                    loading="lazy"
                  />
                  <h3>{game.title}</h3>
                </GameCard>
              </Scrub>
            ))}
          </GamesGrid>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Hobbies;
