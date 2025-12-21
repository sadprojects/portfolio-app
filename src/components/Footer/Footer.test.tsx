import { ThemeProvider } from '@contexts/ThemeContext';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

// Mock VersionModal to track if it opens
vi.mock('@components/VersionModal/VersionModal', () => ({
  VersionModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
    isOpen ? <div data-testid="version-modal"><button onClick={onClose}>Close</button></div> : null,
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

  it('should open version modal on double click of name', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    const nameElement = screen.getByText(/Test Name. All rights reserved./i);
    
    // First click
    fireEvent.click(nameElement);
    expect(screen.queryByTestId('version-modal')).toBeNull();
    
    // Second click (double click)
    fireEvent.click(nameElement);
    expect(screen.getByTestId('version-modal')).toBeDefined();
  });

  it('should reset click counter after timeout', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    const nameElement = screen.getByText(/Test Name. All rights reserved./i);
    
    // First click
    fireEvent.click(nameElement);
    
    // Wait for timeout (400ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Click again - should not open modal since counter was reset
    fireEvent.click(nameElement);
    expect(screen.queryByTestId('version-modal')).toBeNull();
  });

  it('should handle touch events on name', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    const nameElement = screen.getByText(/Test Name. All rights reserved./i);
    
    // Double touch
    fireEvent.touchEnd(nameElement);
    fireEvent.touchEnd(nameElement);
    
    expect(screen.getByTestId('version-modal')).toBeDefined();
  });

  it('should close version modal', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    const nameElement = screen.getByText(/Test Name. All rights reserved./i);
    
    // Open modal with double click
    fireEvent.click(nameElement);
    fireEvent.click(nameElement);
    expect(screen.getByTestId('version-modal')).toBeDefined();
    
    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('version-modal')).toBeNull();
  });
});
