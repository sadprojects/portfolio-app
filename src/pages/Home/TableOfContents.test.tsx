import { ThemeProvider } from '@contexts/ThemeContext';
import { fireEvent, render, screen } from '@testing-library/react';
import { Home } from 'lucide-react';

import { TableOfContents } from './TableOfContents';

const sections = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'projects' as const, label: 'Projects', icon: Home },
];

describe('TableOfContents', () => {
  it('navigates on click and marks the active section', () => {
    const onNavigate = vi.fn();
    render(
      <ThemeProvider>
        <TableOfContents
          sections={sections}
          activeSection="projects"
          onNavigate={onNavigate}
        />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByLabelText('Go to Home'));
    expect(onNavigate).toHaveBeenCalledWith('home');
    expect(screen.getByLabelText('Go to Projects')).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('scrubs the page while the active dot is dragged', () => {
    window.scrollBy = vi.fn();
    render(
      <ThemeProvider>
        <TableOfContents
          sections={sections}
          activeSection="projects"
          onNavigate={vi.fn()}
        />
      </ThemeProvider>,
    );
    const nav = screen.getByLabelText('Sections');
    fireEvent.mouseEnter(nav);
    fireEvent.mouseDown(screen.getByLabelText('Go to Projects'), {
      clientY: 100,
    });
    fireEvent.mouseMove(window, { clientY: 140 });
    expect(window.scrollBy).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(nav); // dragging keeps the labels open
    fireEvent.mouseUp(window);
    fireEvent.mouseMove(window, { clientY: 180 });
    expect(window.scrollBy).toHaveBeenCalledTimes(1);

    // An inactive dot never starts a drag.
    fireEvent.mouseDown(screen.getByLabelText('Go to Home'), { clientY: 0 });
    fireEvent.mouseMove(window, { clientY: 50 });
    expect(window.scrollBy).toHaveBeenCalledTimes(1);
  });
});
