import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { render, screen } from '@testing-library/react';
import Projects from './Projects';

const renderPage = () =>
  render(
    <ThemeProvider>
      <Projects />
    </ThemeProvider>,
  );

describe('Projects', () => {
  it('renders one block per enabled project with a link to its code', () => {
    renderPage();
    const enabled = contentData.projects.filter((p) => p.enabled !== false);
    expect(screen.getAllByRole('article')).toHaveLength(enabled.length);
    enabled.forEach((project) => {
      expect(
        screen.getByRole('link', { name: `View ${project.title} source code` }),
      ).toHaveAttribute('href', project.repo);
    });
  });

  it('shows a video for projects that have one and the Sudoku game inline', async () => {
    const { container } = renderPage();
    const withVideo = contentData.projects.filter(
      (p) => p.video && !p.video.includes('youtu'),
    ).length;
    expect(container.querySelectorAll('video')).toHaveLength(withVideo);
    expect(
      await screen.findByLabelText('Sudoku puzzle grid'),
    ).toBeInTheDocument();
  });
});
