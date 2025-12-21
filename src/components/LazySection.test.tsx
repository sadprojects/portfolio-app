import { render, screen } from '@testing-library/react';
import { LazySection } from './LazySection';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}

  observe() {
    // Simulate immediate intersection for testing
    setTimeout(() => {
      this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }, 0);
  }

  disconnect() {}
  unobserve() {}
  takeRecords() { return []; }
  root = null;
  rootMargin = '';
  thresholds = [];
}

describe('LazySection', () => {
  beforeEach(() => {
    global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it('renders fallback initially', () => {
    render(
      <LazySection fallback={<div>Loading...</div>}>
        <div>Content</div>
      </LazySection>
    );

    expect(screen.queryByText('Content')).toBeNull();
  });

  it('renders children when in view', async () => {
    render(
      <LazySection>
        <div>Content</div>
      </LazySection>
    );

    // Wait for IntersectionObserver callback
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('accepts custom rootMargin', () => {
    const observeSpy = vi.fn();

    class SpyIntersectionObserver extends MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(callback);
        observeSpy(options);
      }
    }

    global.IntersectionObserver = SpyIntersectionObserver as unknown as typeof IntersectionObserver;

    render(
      <LazySection rootMargin="200px">
        <div>Content</div>
      </LazySection>
    );

    expect(observeSpy).toHaveBeenCalledWith(expect.objectContaining({
      rootMargin: '200px',
    }));
  });
});
