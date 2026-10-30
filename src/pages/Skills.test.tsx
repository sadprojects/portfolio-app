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

  it('shows every enabled skill with its proficiency by default', () => {
    renderPage();
    const enabled = contentData.skills.professional.filter(
      (s) => s.enabled !== false,
    );
    enabled.forEach((skill) => {
      expect(
        screen.getByLabelText(`${skill.name}, ${skill.level}%`),
      ).toBeInTheDocument();
    });
  });

  it('filters the grid by category', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Frontend' }));
    expect(screen.getByRole('tab', { name: 'Frontend' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByLabelText(/^React,/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^MongoDB,/)).toBeNull();
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
