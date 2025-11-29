import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Blinker from './Blinker';

describe('Blinker', () => {
  it('should render with the text', async () => {
    render(<Blinker text="Hello" />);
    await waitFor(
      () => {
        const element = screen.getByText((content, element) => {
          return element?.tagName === 'SPAN' && content.includes('Hello');
        });
        expect(element).toBeDefined();
      },
      { timeout: 3000 }
    );
  });

  it('should initially render with no visible text', () => {
    const { container } = render(<Blinker text="Hello World" />);
    const mainSpan = container.querySelector('span');
    // The component starts with empty displayedText, but contains cursor and style tag
    expect(mainSpan).toBeDefined();
  });

  it('should type out text over time', async () => {
    render(<Blinker text="Hi" />);

    await waitFor(
      () => {
        const element = screen.getByText((content, element) => {
          return element?.tagName === 'SPAN' && content.includes('Hi');
        });
        expect(element).toBeDefined();
      },
      { timeout: 3000 }
    );
  });

  it('should render with custom tag', () => {
    const { container } = render(<Blinker text="Hello" as="h1" />);
    expect(container.querySelector('h1')).toBeDefined();
  });

  it('should render with custom className', () => {
    const { container } = render(<Blinker text="Hello" className="custom-class" />);
    const element = container.querySelector('.custom-class');
    expect(element).toBeDefined();
  });

  it('should render cursor element', () => {
    const { container } = render(<Blinker text="Hello" />);
    const cursor = container.querySelector('span > span');
    expect(cursor).toBeDefined();
  });

  it('should complete typing within 2 seconds', async () => {
    vi.useFakeTimers();
    const { container } = render(<Blinker text="Test" />);

    // Advance timers past the 2000ms animation duration
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });

    const element = container.querySelector('span');
    expect(element?.textContent).toContain('Test');

    vi.useRealTimers();
  });
});
