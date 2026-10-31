import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { fireEvent, render, screen } from '@testing-library/react';

import { Desk } from './Desk';

const onScreen = {
  id: 'projects' as const,
  intro: { label: 'Side projects', text: 'Things I built.' },
  body: <p>Project cards</p>,
};
const inDock = {
  id: 'skills' as const,
  intro: { label: 'Craft', text: 'Front-end first.' },
  body: <button type="button">Skill tile</button>,
};

const renderDesk = () =>
  render(
    <ThemeProvider>
      <Desk onScreen={onScreen} inDock={inDock} />
    </ThemeProvider>,
  );

describe('Desk', () => {
  it('hosts both sections behind one laptop, in order, with the CV in its dock', () => {
    const { container } = renderDesk();
    const laptop = container.querySelector(
      'img[src="/media/images/laptop.svg"]',
    )!;
    const track = laptop.closest('section')!;
    expect(
      [...track.querySelectorAll('[data-section]')].map((element) =>
        element.getAttribute('data-section'),
      ),
    ).toEqual(['projects', 'skills']);
    expect(track).toContainElement(screen.getByText('Project cards'));
    expect(track).toContainElement(screen.getByText('Skill tile'));
    expect(screen.getAllByText(onScreen.intro.text)).toHaveLength(1);
    expect(screen.getByText(inDock.intro.text)).toBeInTheDocument();
    // The file name shows on the dock label and the document's title bar.
    expect(screen.getAllByText(contentData.contact.cv)).toHaveLength(2);
  });

  it('scrolls a keyboard-focused control onto the screen, leaving pointer focus alone', () => {
    renderDesk();
    // The section in the document starts hidden until the document opens.
    const button = screen.getByRole('button', { hidden: true });
    const matches = vi.spyOn(button, 'matches');
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    scrollIntoView.mockClear();

    matches.mockReturnValue(false);
    fireEvent.focus(button);
    expect(scrollIntoView).not.toHaveBeenCalled();

    matches.mockReturnValue(true);
    fireEvent.focus(button);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
  });
});
