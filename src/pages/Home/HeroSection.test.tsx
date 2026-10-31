import { IntroProvider, useIntro } from '@contexts/IntroContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { HeroSection } from './HeroSection';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motion.reduce,
}));
vi.mock('@utils/greetings', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@utils/greetings')>()),
  fetchWeatherData: vi.fn().mockResolvedValue({ temp: 40, condition: 'clear' }),
}));

const Lift = () => {
  const { finish } = useIntro();
  return <button onClick={finish}>lift</button>;
};

const renderHero = () => {
  const onScrollDown = vi.fn();
  const onViewWork = vi.fn();
  const utils = render(
    <ThemeProvider>
      <IntroProvider>
        <Lift />
        <HeroSection onViewWork={onViewWork} onScrollDown={onScrollDown} />
      </IntroProvider>
    </ThemeProvider>,
  );
  const live = utils.container.querySelector('[aria-live="polite"]')!;
  return { onScrollDown, onViewWork, live, ...utils };
};

describe('HeroSection', () => {
  beforeEach(() => {
    motion.reduce = false;
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('types the greeting out and wires the two calls to action', async () => {
    const { onScrollDown, onViewWork, container } = renderHero();
    fireEvent.click(screen.getByText('lift'));
    const typed = container.querySelector('[aria-hidden="true"]')!;
    await vi.waitFor(() => expect(typed.textContent).toMatch(/Silviu/), {
      timeout: 4000,
    });

    fireEvent.click(screen.getByLabelText('Scroll down'));
    expect(onScrollDown).toHaveBeenCalled();
    fireEvent.click(screen.getByText('View My Work'));
    expect(onViewWork).toHaveBeenCalled();
  });

  it('greets straight away, then cycles through time and weather lines once lifted', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const { live } = renderHero();
    expect(live.textContent).toMatch(/I'm Silviu$/);

    fireEvent.click(screen.getByText('lift'));
    await act(() => vi.advanceTimersByTimeAsync(2_100)); // weather arrives, timer restarts
    await act(() => vi.advanceTimersByTimeAsync(9_100));
    expect(live.textContent).toMatch(/Hot day!|Stay cool!|Summer heat!/);

    await act(() => vi.advanceTimersByTimeAsync(9_000));
    expect(live.textContent).toMatch(/I'm Silviu$/);
  });

  it('shows the whole greeting at once under reduced motion', () => {
    motion.reduce = true;
    renderHero();
    expect(screen.getAllByText(/I'm Silviu/)).toHaveLength(2);
  });
});
