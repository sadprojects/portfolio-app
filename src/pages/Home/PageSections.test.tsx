import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { render, screen } from '@testing-library/react';

import { PageSections } from './PageSections';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motion.reduce,
}));

const LAPTOP = 'img[src^="/media/images/laptop-"]';
const CAMERA = 'img[src="/media/images/camera.webp"]';

const renderSections = () =>
  render(
    <ThemeProvider>
      <PageSections />
    </ThemeProvider>,
  );

/* Each section opens with its own line from content.ts, inside the frame agreed for it. */
describe('section openers', () => {
  const width = window.innerWidth;
  beforeEach(() => {
    motion.reduce = false;
    window.innerWidth = 1280;
  });
  afterEach(() => {
    window.innerWidth = width;
  });

  it('show every section line once, in its frame', () => {
    const { container } = renderSections();
    const { experience, projects, skills, hobbies } = contentData.sections;
    [experience, projects, skills, hobbies].forEach((section) => {
      expect(screen.getAllByText(section.intro!.text)).toHaveLength(1);
    });
    // Projects: inside the laptop. Skills: in the CV's viewer. Hobbies: on the camera's screen.
    expect(container.querySelector(LAPTOP)).toBeInTheDocument();
    expect(screen.getAllByText(contentData.contact.cv).length).toBeGreaterThan(
      0,
    );
    expect(container.querySelector(CAMERA)).toBeInTheDocument();
    expect(
      screen.getByText(`1/${hobbies.banners!.length}`),
    ).toBeInTheDocument();
  });

  it('host projects and skills on one laptop on wide screens', () => {
    const { container } = renderSections();
    // The artwork comes as a lid and a base, both inside one desk.
    const laptops = [...container.querySelectorAll<HTMLImageElement>(LAPTOP)];
    const desk = laptops[0].closest('section')!;
    laptops.forEach((laptop) => expect(desk).toContainElement(laptop));
    expect(desk).toContainElement(
      container.querySelector('[data-section="projects"]'),
    );
    expect(desk).toContainElement(
      container.querySelector('[data-section="skills"]'),
    );
    expect(container.querySelectorAll('[data-section]')).toHaveLength(4);
  });

  it('open with the frames and run the sections below them on phones', () => {
    window.innerWidth = 500;
    const { container } = renderSections();
    const projects = container.querySelector('[data-section="projects"]')!;
    expect(container.querySelector(LAPTOP)).toBeInTheDocument();
    expect(projects).not.toContainElement(container.querySelector(LAPTOP));
    expect(container.querySelectorAll('[data-section]')).toHaveLength(4);
  });

  it('fall back to plain statements and photo blocks under reduced motion', () => {
    motion.reduce = true;
    const { container } = renderSections();
    expect(container.querySelector(LAPTOP)).toBeNull();
    expect(screen.queryByText(/^1\/\d/)).toBeNull();
    expect(screen.getAllByTestId('media-block')).toHaveLength(
      contentData.sections.hobbies.banners!.length,
    );
  });
});
