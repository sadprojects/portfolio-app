import { fetchWeatherData, type WeatherData } from '@utils/greetings';
import { useEffect, useState } from 'react';

const WEATHER_DELAY_MS = 2000;

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWeatherData().then(setWeather);
    }, WEATHER_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return weather;
};
