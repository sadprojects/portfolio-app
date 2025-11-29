import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

// Mock the content data
vi.mock('@data/content', () => ({
  contentData: {
    social: [
      { name: 'github', url: 'https://github.com/test' },
      { name: 'linkedin', url: 'https://linkedin.com/in/test' },
      { name: 'twitter', url: 'https://twitter.com/test' },
    ],
    footer: 'Test Name. All rights reserved.',
  },
}));

describe('Footer', () => {
  it('should render the footer', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );
    expect(screen.getByText(/Test Name. All rights reserved./i)).toBeDefined();
  });

  it('should render social links', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    const githubLink = screen.getByLabelText('github');
    const linkedinLink = screen.getByLabelText('linkedin');
    const twitterLink = screen.getByLabelText('twitter');

    expect(githubLink.getAttribute('href')).toBe('https://github.com/test');
    expect(linkedinLink.getAttribute('href')).toBe('https://linkedin.com/in/test');
    expect(twitterLink.getAttribute('href')).toBe('https://twitter.com/test');
  });

  it('should render current year in copyright', () => {
    const currentYear = new Date().getFullYear();
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeDefined();
  });

  it('should open social links in new tab', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    const githubLink = screen.getByLabelText('github');
    expect(githubLink.getAttribute('target')).toBe('_blank');
    expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
