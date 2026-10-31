import { contentData } from '@data/content';

import {
  fetchWeatherData,
  getIntroduction,
  getTimeOfDay,
  nextGreeting,
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

describe('nextGreeting', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('opens with a casual greeting and an introduction', () => {
    const first = nextGreeting(null);
    expect(first.kind).toBe('casual');
    expect(first.text).toMatch(
      /^(Hey there!|Hello!|Hi!) (I'm Silviu\.|Welcome to my site\.)$/,
    );
  });

  it('alternates casual lines with the time of day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T08:00:00'));
    expect(nextGreeting('casual')).toEqual({
      text: 'Good morning!',
      kind: 'timeBased',
    });
    expect(nextGreeting('timeBased').kind).toBe('casual');
    expect(nextGreeting('weather').kind).toBe('casual');
  });

  it('lets the weather speak 30% of the time after a casual line', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    expect(nextGreeting('casual', { temp: 20, condition: 'rain' })).toEqual({
      text: 'Rainy day!',
      kind: 'weather',
    });
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(nextGreeting('casual', { temp: 20, condition: 'rain' }).kind).toBe(
      'timeBased',
    );
  });

  it.each([
    [{ temp: 2, condition: 'clear' }, 'Brrr, cold!'],
    [{ temp: 35, condition: 'clear' }, 'Hot day!'],
    [{ temp: 20, condition: 'snow' }, 'Snowy day!'],
    [{ temp: 20, condition: 'clouds' }, 'Cloudy day!'],
    [{ temp: 20, condition: 'clear' }, 'Beautiful day!'],
  ] as const)('picks the right line for %o', (weather, text) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    expect(nextGreeting('casual', weather).text).toBe(text);
  });
});

describe('fetchWeatherData', () => {
  it('returns null without asking when location permission is not granted', async () => {
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: { query: vi.fn().mockResolvedValue({ state: 'denied' }) },
    });
    expect(await fetchWeatherData()).toBeNull();
    expect(navigator.geolocation.getCurrentPosition).not.toHaveBeenCalled();
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: undefined,
    });
  });

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
