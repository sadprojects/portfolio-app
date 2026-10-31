import { ExternalLink } from 'lucide-react';
import styled from 'styled-components';

import { codewarsProfileUrl, type CodewarsProfile } from './useCodewars';

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

const ProfileLink = styled.a`
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

interface CodewarsStatsProps {
  profile: CodewarsProfile;
  username: string;
}

export const CodewarsStats = ({ profile, username }: CodewarsStatsProps) => (
  <>
    <Stats>
      <Stat>
        <strong>{profile.ranks.overall.name}</strong>
        <span>Rank</span>
      </Stat>
      <Stat>
        <strong>{profile.honor.toLocaleString()}</strong>
        <span>Honor</span>
      </Stat>
      <Stat>
        <strong>{profile.codeChallenges.totalCompleted}</strong>
        <span>Kata solved</span>
      </Stat>
    </Stats>
    <ProfileLink
      href={codewarsProfileUrl(username)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Profile
      <ExternalLink size={14} />
    </ProfileLink>
  </>
);
