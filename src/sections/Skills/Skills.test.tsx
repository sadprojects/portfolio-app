import { ThemeProvider } from '@contexts/ThemeContext';
import { contentData } from '@data/content';
import { fireEvent, render, screen } from '@testing-library/react';

import Skills from './Skills';

const renderPage = () =>
  render(
    <ThemeProvider>
      <Skills />
    </ThemeProvider>,
  );

describe('Skills & Credentials', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  });

  it('shows every enabled skill by default', () => {
    renderPage();
    contentData.skills.professional.forEach((skill) => {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/^\d+%$/)).toHaveLength(
      contentData.skills.professional.length,
    );
  });

  it('filters the grid by category', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Frontend' }));
    expect(screen.getByRole('tab', { name: 'Frontend' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('MongoDB')).toBeNull();
  });

  it('shows Codewars stats once the profile loads', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          honor: 1234,
          ranks: { overall: { name: '5 kyu' } },
          codeChallenges: { totalCompleted: 42 },
        }),
      }),
    );
    renderPage();
    expect(await screen.findByText('5 kyu')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Profile/ })).toHaveAttribute(
      'href',
      `https://www.codewars.com/users/${contentData.codewars.username}`,
    );
  });

  it('lists certifications as credential cards linking to the certificate', () => {
    renderPage();
    contentData.certifications.forEach((cert) => {
      expect(
        screen.getByRole('link', { name: `${cert.title}, view certificate` }),
      ).toHaveAttribute('href', cert.url);
    });
  });
});
