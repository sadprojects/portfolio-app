import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { fireEvent, render, screen } from '@testing-library/react';

import Hobbies from './Hobbies';

const renderPage = () =>
  render(
    <ThemeProvider>
      <Hobbies />
    </ThemeProvider>,
  );

describe('Hobbies', () => {
  it('shows every photo as a link to its Unsplash page', () => {
    renderPage();
    contentData.photography.forEach((photo) => {
      expect(
        screen.getByRole('link', { name: `${photo.alt}, view on Unsplash` }),
      ).toHaveAttribute('href', photo.url);
    });
  });

  it('renders nothing without photos or games, and opens on games when there are no photos', async () => {
    const load = async (photography: unknown[], games: unknown[]) => {
      vi.resetModules();
      vi.doMock('@data/content', () => ({
        contentData: {
          photography,
          games,
          sections: { hobbies: { label: 'Hobbies', title: 'My Hobbies' } },
        },
      }));
      return (await import('./Hobbies')).default;
    };
    const Empty = await load([], []);
    const { container, unmount } = render(
      <ThemeProvider>
        <Empty />
      </ThemeProvider>,
    );
    expect(container).toBeEmptyDOMElement();
    unmount();

    const GamesOnly = await load([], [{ title: 'Tetris', icon: 'tetris.jpg' }]);
    render(
      <ThemeProvider>
        <GamesOnly />
      </ThemeProvider>,
    );
    expect(screen.getByRole('tab', { name: /Gaming/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.queryByRole('tab', { name: /Photography/ })).toBeNull();
    vi.doUnmock('@data/content');
  });

  it('switches to the games tab', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: /Gaming/ }));
    for (const game of contentData.games) {
      expect(await screen.findByText(game.title)).toBeInTheDocument();
    }
  });
});
