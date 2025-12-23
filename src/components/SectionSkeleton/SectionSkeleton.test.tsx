import { ThemeProvider } from '@contexts/ThemeContext';
import { render } from '@testing-library/react';
import { SectionSkeleton } from './SectionSkeleton';

describe('SectionSkeleton', () => {
  it('should render the skeleton section with correct data-section attribute', () => {
    render(
      <ThemeProvider>
        <SectionSkeleton sectionId="test-section" />
      </ThemeProvider>,
    );

    const section = document.querySelector('[data-section="test-section"]');
    expect(section).toBeDefined();
    expect(section).not.toBeNull();
  });

  it('should render skeleton title and content cards', () => {
    const { container } = render(
      <ThemeProvider>
        <SectionSkeleton sectionId="projects" />
      </ThemeProvider>,
    );

    // Should have a skeleton section
    const section = container.querySelector('section');
    expect(section).toBeDefined();
    expect(section).not.toBeNull();
  });

  it('should be memoized with displayName', () => {
    expect(SectionSkeleton.displayName).toBe('SectionSkeleton');
  });

  it('should render with different section ids', () => {
    const { rerender, container } = render(
      <ThemeProvider>
        <SectionSkeleton sectionId="skills" />
      </ThemeProvider>,
    );

    let section = container.querySelector('[data-section="skills"]');
    expect(section).not.toBeNull();

    rerender(
      <ThemeProvider>
        <SectionSkeleton sectionId="experience" />
      </ThemeProvider>,
    );

    section = container.querySelector('[data-section="experience"]');
    expect(section).not.toBeNull();
  });
});
