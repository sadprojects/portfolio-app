import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { fireEvent, render, screen } from '@testing-library/react';

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
    const { projects } = contentData;
    expect(screen.getAllByRole('article')).toHaveLength(projects.length);
    projects.forEach((project) => {
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

  it('loads the YouTube player only when its still is clicked', () => {
    const { container } = renderPage();
    const hosted = contentData.projects.find((p) =>
      p.video?.includes('youtu'),
    )!;
    expect(container.querySelector('iframe')).toBeNull();
    fireEvent.click(screen.getByLabelText(`Play ${hosted.title} video`));
    const id = new URL(hosted.video!).pathname.slice(1);
    expect(container.querySelector('iframe')).toHaveAttribute(
      'src',
      expect.stringContaining(`/embed/${id}`),
    );
  });
});
