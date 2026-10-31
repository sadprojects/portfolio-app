import { Scrub } from '@components/motion/Scrub';
import type { Photography } from '@data/types';
import { stagger } from '@styles/motion';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import styled from 'styled-components';

const GridOfPhotos = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: clamp(2rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 3.5rem);

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
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

  @media (hover: none) {
    &::after {
      opacity: 1;
    }
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

  @media (hover: none) {
    opacity: 1;
    transform: none;
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

export const PhotoGrid = ({ photos }: { photos: Photography[] }) => (
  <GridOfPhotos
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
            src={`/media/images/${photo.path}`}
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
  </GridOfPhotos>
);
