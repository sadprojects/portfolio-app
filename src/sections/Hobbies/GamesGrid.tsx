import { Scrub } from '@components/motion/Scrub';
import type { Game } from '@data/types';
import { stagger } from '@styles/motion';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const GridOfGames = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
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

export const GamesGrid = ({ games }: { games: Game[] }) => (
  <GridOfGames
    variants={stagger(0.05)}
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0 }}
  >
    {games.map((game) => (
      <Scrub key={game.title}>
        <GameCard>
          <img src={`/media/images/${game.icon}`} alt="" loading="lazy" />
          <h3>{game.title}</h3>
        </GameCard>
      </Scrub>
    ))}
  </GridOfGames>
);
