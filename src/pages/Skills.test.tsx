import { ThemeProvider } from '@contexts/ThemeContext';
import Skills from '@pages/Skills';
import { render, screen } from '@testing-library/react';

describe('Skills', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <Skills />
      </ThemeProvider>
    );
    expect(screen.getByText('Skills & Expertise')).toBeDefined();
  });

  it('displays the correct subtitle', () => {
    render(
      <ThemeProvider>
        <Skills />
      </ThemeProvider>
    );
    expect(screen.getByText('My technical and professional capabilities')).toBeDefined();
  });

  it('renders technical skills section', () => {
    render(
      <ThemeProvider>
        <Skills />
      </ThemeProvider>
    );

    expect(screen.getByText('Technical Skills')).toBeDefined();
    expect(screen.getByText('Javascript')).toBeDefined();
    expect(screen.getByText('ReactJS')).toBeDefined();
  });

  it('renders languages section', () => {
    render(
      <ThemeProvider>
        <Skills />
      </ThemeProvider>
    );

    expect(screen.getByText('Languages')).toBeDefined();
    expect(screen.getByText('English')).toBeDefined();
    expect(screen.getByText('Romanian')).toBeDefined();
  });

  it('renders development tools section', () => {
    render(
      <ThemeProvider>
        <Skills />
      </ThemeProvider>
    );

    expect(screen.getByText('Development Tools')).toBeDefined();
    expect(screen.getByText('Git')).toBeDefined();
  });

  it('renders soft skills section', () => {
    render(
      <ThemeProvider>
        <Skills />
      </ThemeProvider>
    );

    expect(screen.getByText('Soft Skills')).toBeDefined();
    expect(screen.getByText('Team player')).toBeDefined();
  });
});
