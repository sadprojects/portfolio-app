import { nextGreeting, type WeatherData } from '@utils/greetings';
import { useEffect, useState } from 'react';

const GREETING_INTERVAL_MS = 9000;

export const useGreeting = (ready: boolean, weather: WeatherData | null) => {
  const [greeting, setGreeting] = useState(() => nextGreeting(null));

  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(
      () => setGreeting((previous) => nextGreeting(previous.kind, weather)),
      GREETING_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [ready, weather]);

  return greeting.text;
};
