import { IntroProvider, useIntro } from '@contexts/IntroContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { act, render, screen } from '@testing-library/react';

import { IntroLoader } from './IntroLoader';

const Lifted = () => {
  const { done } = useIntro();
  return <span>{done ? 'lifted' : 'down'}</span>;
};

const renderCurtain = () =>
  render(
    <ThemeProvider>
      <IntroProvider>
        <IntroLoader />
        <Lifted />
      </IntroProvider>
    </ThemeProvider>,
  );

describe('IntroLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'Date',
        'performance',
      ],
    });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('decodes the name, locks scrolling, and lifts after the minimum time', async () => {
    renderCurtain();
    expect(screen.getByTestId('intro-loader')).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(screen.getByText('down')).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(1500));
    expect(screen.getByText(contentData.contact.name)).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(2000));
    expect(screen.getByText('lifted')).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('rains glyphs on the canvas when a 2D context exists', async () => {
    const ctx = {
      scale: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      fillStyle: '',
      font: '',
    };
    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockReturnValue(ctx) as unknown as HTMLCanvasElement['getContext'];
    renderCurtain();
    await act(() => vi.advanceTimersByTimeAsync(300));
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it('never shows when the intro is already done', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    renderCurtain();
    expect(screen.queryByTestId('intro-loader')).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('restores scrolling when unmounted early', () => {
    const { unmount } = renderCurtain();
    unmount();
    expect(document.documentElement.style.overflow).toBe('');
  });
});
