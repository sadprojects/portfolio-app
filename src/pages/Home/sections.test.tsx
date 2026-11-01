import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import Home from '@pages/Home/Home';
import { render } from '@testing-library/react';

import { SECTIONS } from './sections';

/* Guards the page's structure: what the order must keep and how each section opens. */
describe('page sections', () => {
  it('start at home and end at contact, with a body for everything between', () => {
    const ids = SECTIONS.map((section) => section.id);
    expect(ids[0]).toBe('home');
    expect(ids.at(-1)).toBe('contact');
    expect(new Set(ids).size).toBe(ids.length);
    SECTIONS.slice(1, -1).forEach((section) => {
      expect(section.Component).toBeDefined();
      expect(section.transition).toBeDefined();
    });
  });

  it('open the agreed way', () => {
    const openers = Object.fromEntries(
      SECTIONS.filter((s) => s.transition).map((s) => [s.id, s.transition]),
    );
    expect(openers).toEqual({
      experience: 'zoom',
      projects: 'laptop',
      skills: 'resume',
      hobbies: 'camera',
    });
  });

  it('take their labels and copy from content.ts', () => {
    SECTIONS.forEach((section) => {
      expect(section.label).toBe(contentData.sections[section.id].label);
      if (section.Component) expect(section.intro).toBeDefined();
    });
    const camera = SECTIONS.find((s) => s.transition === 'camera');
    expect(camera?.banners?.length).toBeGreaterThanOrEqual(2);
  });

  it('render on the page in that order', () => {
    const { container } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    const ids = [...container.querySelectorAll('[data-section]')].map((el) =>
      el.getAttribute('data-section'),
    );
    // Contact is the footer, rendered by App rather than Home.
    expect(ids).toEqual(
      SECTIONS.filter((s) => s.id !== 'contact').map((s) => s.id),
    );
  });
});
