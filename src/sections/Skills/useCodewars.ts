import { useEffect, useState } from 'react';

export interface CodewarsProfile {
  honor: number;
  ranks: { overall: { name: string } };
  codeChallenges: { totalCompleted: number };
}

export const codewarsProfileUrl = (username: string) =>
  `https://www.codewars.com/users/${username}`;

export const useCodewars = (username: string) => {
  const [profile, setProfile] = useState<CodewarsProfile | null>(null);

  useEffect(() => {
    if (!username) return;
    fetch(`https://www.codewars.com/api/v1/users/${username}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setProfile(data))
      .catch((error) => console.error('Failed to fetch Codewars data:', error));
  }, [username]);

  return profile;
};
