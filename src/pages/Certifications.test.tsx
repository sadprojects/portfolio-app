import { ThemeProvider } from '@contexts/ThemeContext';
import Certifications from '@pages/Certifications';
import { render, screen } from '@testing-library/react';

describe('Certifications', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <Certifications />
      </ThemeProvider>
    );
    expect(screen.getByText('Certifications')).toBeDefined();
  });

  it('displays the correct subtitle', () => {
    render(
      <ThemeProvider>
        <Certifications />
      </ThemeProvider>
    );
    expect(screen.getByText('Professional certifications and achievements')).toBeDefined();
  });

  it('renders certification cards', () => {
    render(
      <ThemeProvider>
        <Certifications />
      </ThemeProvider>
    );

    // Check that certification titles are rendered
    expect(screen.getByText(/Published Research: Neural Network Based System for Disease Prediction/i)).toBeDefined();
    expect(screen.getByText(/Microsoft Certified - Azure Fundamentals/i)).toBeDefined();
    expect(screen.getByText(/MongoDB - SI Associate Certification/i)).toBeDefined();
  });

  it('renders certification dates', () => {
    render(
      <ThemeProvider>
        <Certifications />
      </ThemeProvider>
    );

    expect(screen.getByText('Dec 2021')).toBeDefined();
    expect(screen.getByText('18 Sep 2023')).toBeDefined();
    expect(screen.getByText('16 Jun 2023')).toBeDefined();
  });

  it('renders links to view certificates', () => {
    render(
      <ThemeProvider>
        <Certifications />
      </ThemeProvider>
    );

    const links = screen.getAllByText('View Certificate');
    expect(links).toHaveLength(3);
  });
});
