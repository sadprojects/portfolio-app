import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import type { SectionId } from '@data/types';
import { render, screen } from '@testing-library/react';

import { PageSections } from './PageSections';
import { SECTIONS } from './sections';

/* The page is built from SECTIONS alone, so a reordered copy of it is the whole configuration. */
const agreed = [...SECTIONS];
const order = (ids: SectionId[]) =>
  SECTIONS.splice(
    0,
    SECTIONS.length,
    ...ids.map((id) => agreed.find((section) => section.id === id)!),
  );

const LAPTOP = 'img[src*="laptop-"]';
const CAMERA = 'img[src="/media/images/camera.webp"]';

const renderSections = () =>
  render(
    <ThemeProvider>
      <PageSections />
    </ThemeProvider>,
  );
/* The sections hosted by the laptop's desk; none when the laptop is an opener on its own. */
const onDesk = (container: HTMLElement) => {
  const track = container.querySelector(LAPTOP)?.closest('section');
  return [...(track?.querySelectorAll('[data-section]') ?? [])].map((element) =>
    element.getAttribute('data-section'),
  );
};
const deskMargin = (container: HTMLElement) =>
  getComputedStyle(container.querySelector(LAPTOP)!.closest('section')!)
    .marginBottom;

/* Wide screens; the sections keep their openers in any order. */
describe('the page in another order', () => {
  const width = window.innerWidth;
  beforeEach(() => {
    window.innerWidth = 1280;
  });
  afterEach(() => {
    window.innerWidth = width;
    order(agreed.map((section) => section.id));
  });

  it('renders the sections in the order given', () => {
    order(['home', 'hobbies', 'experience', 'projects', 'skills', 'contact']);
    const { container } = renderSections();
    expect(
      [...container.querySelectorAll('[data-section]')].map((element) =>
        element.getAttribute('data-section'),
      ),
    ).toEqual(['hobbies', 'experience', 'projects', 'skills']);
  });

  it('shares one desk only when the laptop section is directly followed by the resume section', () => {
    order(['home', 'experience', 'projects', 'skills', 'hobbies', 'contact']);
    const { container, unmount } = renderSections();
    expect(onDesk(container)).toEqual(['projects', 'skills']);
    unmount();

    // The CV before the projects: the CV opens on its own, then the laptop on its own, each with its line.
    order(['home', 'experience', 'skills', 'projects', 'hobbies', 'contact']);
    const { container: apart } = renderSections();
    expect(onDesk(apart)).toEqual([]);
    expect(apart.querySelectorAll('[data-section]')).toHaveLength(4);
    expect(screen.getAllByText(contentData.contact.cv).length).toBeGreaterThan(
      0,
    );
    const { projects, skills } = contentData.sections;
    expect(screen.getAllByText(projects.intro!.text)).toHaveLength(1);
    expect(screen.getAllByText(skills.intro!.text)).toHaveLength(1);
  });

  it('lets the camera wait under the closing laptop, and anything else follow it', () => {
    order(['home', 'experience', 'projects', 'skills', 'hobbies', 'contact']);
    const { container, unmount } = renderSections();
    expect(container.querySelector(CAMERA)).toBeInTheDocument();
    expect(deskMargin(container)).toBe('-128vh');
    unmount();

    order(['home', 'projects', 'skills', 'experience', 'hobbies', 'contact']);
    const { container: zoomNext } = renderSections();
    expect(deskMargin(zoomNext)).toBe('-28vh');
  });
});
