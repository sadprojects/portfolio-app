import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { render, screen } from '@testing-library/react';

import { PageSections } from './PageSections';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motion.reduce,
}));

const renderSections = () =>
  render(
    <ThemeProvider>
      <PageSections />
    </ThemeProvider>,
  );

/* Each section opens with its own line from content.ts, inside the frame agreed for it. */
describe('section openers', () => {
  beforeEach(() => {
    motion.reduce = false;
  });

  it('show every section line once, in its frame', () => {
    const { container } = renderSections();
    const { experience, projects, skills, hobbies } = contentData.sections;
    [experience, projects, skills, hobbies].forEach((section) => {
      expect(screen.getAllByText(section.intro!.text)).toHaveLength(1);
    });
    // Projects: inside the laptop. Skills: on the resume sheet. Hobbies: on the camera's screen.
    expect(
      container.querySelector('img[src="/media/images/laptop.svg"]'),
    ).toBeInTheDocument();
    expect(screen.getByText(skills.intro!.label)).toBeInTheDocument();
    expect(
      container.querySelector('img[src="/media/images/camera.webp"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`1/${hobbies.banners!.length}`),
    ).toBeInTheDocument();
  });

  it('fall back to plain statements and photo blocks under reduced motion', () => {
    motion.reduce = true;
    const { container } = renderSections();
    expect(
      container.querySelector('img[src="/media/images/laptop.svg"]'),
    ).toBeNull();
    expect(screen.queryByText(/^1\/\d/)).toBeNull();
    expect(screen.getAllByTestId('media-block')).toHaveLength(
      contentData.sections.hobbies.banners!.length,
    );
  });
});
