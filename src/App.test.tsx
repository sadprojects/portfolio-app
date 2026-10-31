import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';

vi.mock('@pages/Home/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));
vi.mock('@pages/NotFound/NotFound', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));
vi.mock('react-snowfall', () => ({
  default: () => <div data-testid="snowfall">Snowfall</div>,
}));
vi.mock('@components/Footer/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

/* Routing is decided once from the URL at import time, so each case loads the module afresh. */
const renderAt = async (url: string) => {
  window.history.replaceState(null, '', url);
  vi.resetModules();
  const { App } = await import('./App');
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
};

describe('App', () => {
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('renders the home page and footer at the root', async () => {
    await renderAt('/');
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('turns an old page URL into the matching anchor of the single page', async () => {
    await renderAt('/certifications');
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#skills');
  });

  it('shows the 404 page for an unknown path', async () => {
    await renderAt('/nope');
    expect(await screen.findByTestId('not-found-page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/nope');
  });

  it('sends /home to the root without an anchor', async () => {
    await renderAt('/home');
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('');
  });

  it('lets it snow in either theme once the intro is out of the way', async () => {
    localStorage.setItem('snowfallEnabled', 'true');
    localStorage.setItem('theme', 'light');
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    await renderAt('/');
    expect(await screen.findByTestId('snowfall')).toBeInTheDocument();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('holds the snow back until the intro has lifted', async () => {
    localStorage.setItem('snowfallEnabled', 'true');
    await renderAt('/');
    await screen.findByTestId('home-page');
    expect(screen.queryByTestId('snowfall')).toBeNull();
  });
});
