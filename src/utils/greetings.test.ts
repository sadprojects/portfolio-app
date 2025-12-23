import { contentData } from '@data/content';
import {
  fetchWeatherData,
  getCompleteGreeting,
  getIntroduction,
  getTimeOfDay,
  resetGreetingType,
} from './greetings';

// Mock the content data
vi.mock('@data/content', () => ({
  contentData: {
    greetings: {
      casualGreetings: ['Hey there!', 'Hello!', 'Hi!'],
      introductions: ["I'm Silviu.", 'Welcome to my site.'],
      timeBasedGreetings: [
        { type: 'morning', message: 'Good morning!' },
        { type: 'afternoon', message: 'Good afternoon!' },
        { type: 'evening', message: 'Good evening!' },
      ],
      weatherGreetings: {
        sunny: ['Beautiful day!'],
        rainy: ['Rainy day!'],
        cloudy: ['Cloudy day!'],
        snowy: ['Snowy day!'],
        cold: ['Brrr, cold!'],
        hot: ['Hot day!'],
      },
    },
  },
}));

describe('getTimeOfDay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return morning for hours 5-11', () => {
    vi.setSystemTime(new Date('2025-01-01T08:00:00'));
    expect(getTimeOfDay()).toBe('morning');

    vi.setSystemTime(new Date('2025-01-01T05:00:00'));
    expect(getTimeOfDay()).toBe('morning');

    vi.setSystemTime(new Date('2025-01-01T11:59:00'));
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return afternoon for hours 12-17', () => {
    vi.setSystemTime(new Date('2025-01-01T12:00:00'));
    expect(getTimeOfDay()).toBe('afternoon');

    vi.setSystemTime(new Date('2025-01-01T15:00:00'));
    expect(getTimeOfDay()).toBe('afternoon');

    vi.setSystemTime(new Date('2025-01-01T17:59:00'));
    expect(getTimeOfDay()).toBe('afternoon');
  });

  it('should return evening for hours 18-4', () => {
    vi.setSystemTime(new Date('2025-01-01T18:00:00'));
    expect(getTimeOfDay()).toBe('evening');

    vi.setSystemTime(new Date('2025-01-01T23:00:00'));
    expect(getTimeOfDay()).toBe('evening');

    vi.setSystemTime(new Date('2025-01-01T02:00:00'));
    expect(getTimeOfDay()).toBe('evening');
  });
});

describe('getIntroduction', () => {
  it('should return one of the introductions', () => {
    const intro = getIntroduction();
    expect(contentData.greetings.introductions).toContain(intro);
  });
});

describe('getCompleteGreeting', () => {
  beforeEach(() => {
    resetGreetingType();
  });

  it('should return casual greeting on first call', async () => {
    const greeting = await getCompleteGreeting();

    // First greeting should include a casual greeting and an introduction
    const hasCasual = contentData.greetings.casualGreetings.some((casual) =>
      greeting.includes(casual),
    );
    const hasIntro = contentData.greetings.introductions.some((intro) =>
      greeting.includes(intro),
    );

    expect(hasCasual).toBe(true);
    expect(hasIntro).toBe(true);
  });

  describe('with time-based greetings', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      resetGreetingType();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should alternate to time-based greeting on second call', async () => {
      vi.setSystemTime(new Date('2025-01-01T10:00:00'));

      // First call - casual
      await getCompleteGreeting();

      // Second call - should be time-based (morning)
      const greeting = await getCompleteGreeting();
      expect(greeting).toBe('Good morning!');
    });
  });

  it('should alternate back to casual on third call', async () => {
    // First call - casual
    await getCompleteGreeting();

    // Second call - time-based
    await getCompleteGreeting();

    // Third call - should be casual again
    const greeting = await getCompleteGreeting();

    const hasCasual = contentData.greetings.casualGreetings.some((casual) =>
      greeting.includes(casual),
    );
    expect(hasCasual).toBe(true);
  });

  it('should handle weather greeting when weather data is provided', async () => {
    // Reset to start fresh
    resetGreetingType();

    // First call - casual
    await getCompleteGreeting();

    // Mock Math.random to always return 0.8 (> 0.7, so weather will be used)
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.8);

    // Second call with weather data - should potentially be weather-based
    const weatherData = { temp: 25, condition: 'clear' };
    const greeting = await getCompleteGreeting(weatherData);

    // It should be either weather or time-based
    expect(greeting).toBeDefined();

    randomSpy.mockRestore();
  });

  it('should return cold weather greeting for very low temp', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 0, condition: 'clear' };
    const greeting = await getCompleteGreeting(weatherData);

    // Should be cold greeting
    expect(greeting).toBe('Brrr, cold!');
  });

  it('should return hot weather greeting for very high temp', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 35, condition: 'clear' };
    const greeting = await getCompleteGreeting(weatherData);

    expect(greeting).toBe('Hot day!');
  });

  it('should return rainy greeting for rain condition', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 20, condition: 'rain' };
    const greeting = await getCompleteGreeting(weatherData);

    expect(greeting).toBe('Rainy day!');
  });

  it('should return snowy greeting for snow condition', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 20, condition: 'snow' };
    const greeting = await getCompleteGreeting(weatherData);

    expect(greeting).toBe('Snowy day!');
  });

  it('should return cloudy greeting for clouds condition', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 20, condition: 'clouds' };
    const greeting = await getCompleteGreeting(weatherData);

    expect(greeting).toBe('Cloudy day!');
  });

  it('should return sunny greeting for unknown condition', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 20, condition: 'unknown' };
    const greeting = await getCompleteGreeting(weatherData);

    expect(greeting).toBe('Beautiful day!');
  });

  it('should handle thunderstorm condition', async () => {
    resetGreetingType();
    await getCompleteGreeting();

    vi.spyOn(Math, 'random').mockReturnValue(0.8);

    const weatherData = { temp: 20, condition: 'thunderstorm' };
    const greeting = await getCompleteGreeting(weatherData);

    expect(greeting).toBe('Rainy day!'); // Thunderstorm maps to rainy
  });
});

describe('resetGreetingType', () => {
  it('should reset greeting type so first call is casual again', async () => {
    // Make some calls
    await getCompleteGreeting();
    await getCompleteGreeting();

    // Reset
    resetGreetingType();

    // Next call should be casual
    const greeting = await getCompleteGreeting();

    const hasCasual = contentData.greetings.casualGreetings.some((casual) =>
      greeting.includes(casual),
    );
    expect(hasCasual).toBe(true);
  });
});

describe('fetchWeatherData', () => {
  const mockGeolocationPosition = {
    coords: {
      latitude: 51.5074,
      longitude: -0.1278,
    },
  };

  // Store original geolocation to restore after tests
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore original geolocation mock from setup.ts
    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
    });
  });

  it('should return null when geolocation fails', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((_success, reject) => {
        reject(new Error('Geolocation error'));
      }),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    const result = await fetchWeatherData();
    expect(result).toBeNull();
  });

  it('should return null when fetch fails', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success(mockGeolocationPosition);
      }),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await fetchWeatherData();
    expect(result).toBeNull();
  });

  it('should return weather data on success', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success(mockGeolocationPosition);
      }),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          current: {
            temperature_2m: 18.5,
            weather_code: 0,
          },
        }),
    });

    const result = await fetchWeatherData();
    expect(result).toEqual({
      temp: 19,
      condition: 'clear',
    });
  });

  it('should map weather codes correctly', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success(mockGeolocationPosition);
      }),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    // Test rain code
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          current: {
            temperature_2m: 15,
            weather_code: 61, // rain
          },
        }),
    });

    let result = await fetchWeatherData();
    expect(result?.condition).toBe('rain');

    // Test snow code
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          current: {
            temperature_2m: -2,
            weather_code: 71, // snow
          },
        }),
    });

    result = await fetchWeatherData();
    expect(result?.condition).toBe('snow');

    // Test clouds code
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          current: {
            temperature_2m: 20,
            weather_code: 2, // cloudy
          },
        }),
    });

    result = await fetchWeatherData();
    expect(result?.condition).toBe('clouds');
  });

  it('should return null when API returns not ok', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success(mockGeolocationPosition);
      }),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const result = await fetchWeatherData();
    expect(result).toBeNull();
  });
});
