import { contentData } from '@data/content';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type GreetingKind = 'casual' | 'timeBased' | 'weather';

export interface WeatherData {
  temp: number;
  condition: 'clear' | 'clouds' | 'rain' | 'snow';
}

export interface Greeting {
  text: string;
  kind: GreetingKind;
}

const MORNING_STARTS_AT = 5;
const AFTERNOON_STARTS_AT = 12;
const EVENING_STARTS_AT = 18;
const COLD_BELOW_CELSIUS = 5;
const HOT_ABOVE_CELSIUS = 30;
const WEATHER_GREETING_CHANCE = 0.3;
const LOCATION_TIMEOUT_MS = 5000;
const LOCATION_MAX_AGE_MS = 300_000;
const WMO_CLEAR = 0;
const WMO_FIRST_WET_CODE = 50;
const WMO_SNOW_CODES = [71, 73, 75, 77, 85, 86];

export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= MORNING_STARTS_AT && hour < AFTERNOON_STARTS_AT) return 'morning';
  if (hour >= AFTERNOON_STARTS_AT && hour < EVENING_STARTS_AT)
    return 'afternoon';
  return 'evening';
};

const pickRandom = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const conditionFromWmoCode = (code: number): WeatherData['condition'] => {
  if (code === WMO_CLEAR) return 'clear';
  if (code < WMO_FIRST_WET_CODE) return 'clouds';
  if (WMO_SNOW_CODES.includes(code)) return 'snow';
  return 'rain';
};

const currentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: LOCATION_TIMEOUT_MS,
      maximumAge: LOCATION_MAX_AGE_MS,
    });
  });

export const fetchWeatherData = async (): Promise<WeatherData | null> => {
  try {
    const permission = await navigator.permissions?.query({
      name: 'geolocation',
    });
    if (permission && permission.state !== 'granted') return null;

    const { latitude, longitude } = (await currentPosition()).coords;
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`,
    );
    if (!response.ok) throw new Error('Weather API failed');
    const { current } = await response.json();

    return {
      temp: Math.round(current.temperature_2m),
      condition: conditionFromWmoCode(current.weather_code),
    };
  } catch (error) {
    console.debug('Weather fetch failed:', error);
    return null;
  }
};

const weatherGreeting = (weather: WeatherData): string => {
  const { weatherGreetings } = contentData.greetings;
  if (weather.temp < COLD_BELOW_CELSIUS)
    return pickRandom(weatherGreetings.cold);
  if (weather.temp > HOT_ABOVE_CELSIUS) return pickRandom(weatherGreetings.hot);
  const linesBySky = {
    clear: weatherGreetings.sunny,
    clouds: weatherGreetings.cloudy,
    rain: weatherGreetings.rainy,
    snow: weatherGreetings.snowy,
  };
  return pickRandom(linesBySky[weather.condition]);
};

export const getIntroduction = (): string =>
  pickRandom(contentData.greetings.introductions);

export const nextGreeting = (
  previous: GreetingKind | null,
  weather?: WeatherData | null,
): Greeting => {
  const { timeBasedGreetings, casualGreetings } = contentData.greetings;

  if (previous === 'casual') {
    if (weather && Math.random() < WEATHER_GREETING_CHANCE) {
      return { text: weatherGreeting(weather), kind: 'weather' };
    }
    const timeOfDay = getTimeOfDay();
    const forTimeOfDay = timeBasedGreetings.find(
      (greeting) => greeting.type === timeOfDay,
    );
    return {
      text: forTimeOfDay?.message || casualGreetings[0],
      kind: 'timeBased',
    };
  }

  return {
    text: `${pickRandom(casualGreetings)} ${getIntroduction()}`,
    kind: 'casual',
  };
};
