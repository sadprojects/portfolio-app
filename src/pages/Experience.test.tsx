import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { render, screen, within } from '@testing-library/react';
import Experience from './Experience';

const renderPage = () =>
  render(
    <ThemeProvider>
      <Experience />
    </ThemeProvider>,
  );

describe('Experience Page', () => {
  it('renders one card per company tenure, newest first', () => {
    renderPage();
    const cards = screen.getAllByRole('article');
    const companies = [
      ...new Set(contentData.experience.map((j) => j.company)),
    ];
    expect(cards).toHaveLength(companies.length);
    expect(
      within(cards[0]).getByRole('heading', { level: 3 }),
    ).toHaveTextContent(companies[0]);
  });

  it('stacks the promotion under the same company', () => {
    renderPage();
    const lseg = screen.getAllByRole('article')[0];
    const roles = within(lseg).getAllByRole('heading', { level: 4 });
    expect(roles.map((r) => r.textContent)).toEqual([
      'Lead Software Engineer',
      'Senior Software Engineer',
    ]);
    expect(within(lseg).getByText('Current')).toBeInTheDocument();
  });

  it('shows the full company tenure plus per-role ranges when there are several roles', () => {
    renderPage();
    const lseg = screen.getAllByRole('article')[0];
    expect(within(lseg).getByText('Feb 2024 - Present')).toBeInTheDocument();
    expect(within(lseg).getByText('Oct 2026 - Present')).toBeInTheDocument();
    expect(within(lseg).getByText('Feb 2024 - Sep 2026')).toBeInTheDocument();
  });

  it('does not render a role ladder for single-role companies', () => {
    renderPage();
    const single = screen.getAllByRole('article')[1];
    expect(within(single).getAllByRole('heading', { level: 4 })).toHaveLength(
      1,
    );
  });
});
