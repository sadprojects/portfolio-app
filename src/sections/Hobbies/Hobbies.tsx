import { SectionHeading } from '@components/ui/SectionHeading';
import { contentData } from '@data/content';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Camera, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';

import { GamesGrid } from './GamesGrid';
import { PhotoGrid } from './PhotoGrid';

type HobbyTab = 'photography' | 'games';

const PILL_SPRING = { type: 'spring', stiffness: 400, damping: 32 } as const;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin: 0 auto 7rem;
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
  color: ${({ theme, $active }) => ($active ? theme.colors.background : theme.colors.secondary)};
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

const Hobbies = () => {
  const { photography, games, sections } = contentData;
  const [tab, setTab] = useState<HobbyTab>(
    photography.length ? 'photography' : 'games',
  );

  if (!photography.length && !games.length) return null;

  const tabs = [
    {
      id: 'photography' as const,
      label: 'Photography',
      icon: Camera,
      available: photography.length > 0,
    },
    {
      id: 'games' as const,
      label: 'Gaming',
      icon: Gamepad2,
      available: games.length > 0,
    },
  ].filter((candidate) => candidate.available);

  return (
    <Container>
      <SectionHeading title={sections.hobbies.title} center />

      <LayoutGroup>
        <Tabs role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Tab
              key={id}
              role="tab"
              aria-selected={tab === id}
              $active={tab === id}
              onClick={() => setTab(id)}
            >
              {tab === id && (
                <ActivePill layoutId="hobby-tab" transition={PILL_SPRING} />
              )}
              <Icon size={18} />
              {label}
            </Tab>
          ))}
        </Tabs>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        {tab === 'photography' && (
          <PhotoGrid key="photography" photos={photography} />
        )}
        {tab === 'games' && <GamesGrid key="games" games={games} />}
      </AnimatePresence>
    </Container>
  );
};

export default Hobbies;
