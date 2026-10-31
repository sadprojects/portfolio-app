import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  root!: Element | null;
  rootMargin!: string;
  scrollMargin!: string;
  thresholds!: ReadonlyArray<number>;
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// jsdom has no 2D canvas; components must cope with a null context
HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockReturnValue(null) as unknown as HTMLCanvasElement['getContext'];

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock window.matchMedia; '(max-width: Npx)' queries follow window.innerWidth.
const maxWidth = (query: string) =>
  Number(query.match(/max-width:\s*(\d+)px/)?.[1]);
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: window.innerWidth <= maxWidth(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator.geolocation
Object.defineProperty(global.navigator, 'geolocation', {
  writable: true,
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});

// Mock localStorage
const store = new Map<string, string>();
Object.defineProperty(global, 'localStorage', {
  writable: true,
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: (index: number) => [...store.keys()][index] ?? null,
  },
});
