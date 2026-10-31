import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import Home from '@pages/Home/Home';
import { render } from '@testing-library/react';

import { SECTIONS } from './sections';

/* Guards the page's structure: the order of sections and how each one opens. */
describe('page sections', () => {
  it('run home, experience, projects, skills, hobbies, contact', () => {
    expect(SECTIONS.map((section) => section.id)).toEqual([
      'home',
      'experience',
      'projects',
      'skills',
      'hobbies',
      'contact',
    ]);
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
