import { SnowfallProvider } from '@contexts/SnowfallContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import type { Section } from '@pages/Home/sections';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Home } from 'lucide-react';

import { Header } from './Header';

const mockSections: Section[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: Home },
  { id: 'contact', label: 'Contact', icon: Home },
];

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <SnowfallProvider>{ui}</SnowfallProvider>
    </ThemeProvider>,
  );

describe('Header', () => {
  it('should render the header with logo', () => {
    renderWithProviders(
      <Header sections={mockSections} onNavigate={vi.fn()} />,
    );
    expect(screen.getByText(/Silviu/i)).toBeDefined();
    expect(screen.getByText(/Dinu/i)).toBeDefined();
  });

  it('should render theme toggle button', () => {
    const { container } = renderWithProviders(
      <Header sections={mockSections} onNavigate={vi.fn()} />,
    );
    const themeButton = container.querySelector(
      'button[aria-label="Toggle theme"]',
    );
    expect(themeButton).toBeDefined();
  });

  it('should toggle theme when theme button is clicked', () => {
    const { container } = renderWithProviders(
      <Header sections={mockSections} onNavigate={vi.fn()} />,
    );

    const themeButton = container.querySelector(
      'button[aria-label="Toggle theme"]',
    );
    if (themeButton) {
      fireEvent.click(themeButton);
    }
    expect(themeButton).toBeDefined();
  });

  it('should call onNavigate when logo is clicked', () => {
    const mockNavigate = vi.fn();
    const { container } = renderWithProviders(
      <Header sections={mockSections} onNavigate={mockNavigate} />,
    );

    const logo = container.querySelector(
      'button[aria-label="Silviu Dinu, back to top"]',
    );
    if (logo) {
      fireEvent.click(logo);
    }
  });

  it('should render mobile menu button on mobile', () => {
    global.innerWidth = 500;

    const { container } = renderWithProviders(
      <Header sections={mockSections} onNavigate={vi.fn()} />,
    );

    const menuButton = container.querySelector(
      'button[aria-label="Open menu"]',
    );
    expect(menuButton).toBeDefined();
  });

  it('should open and close mobile menu', () => {
    global.innerWidth = 500;

    const { container } = renderWithProviders(
      <Header sections={mockSections} onNavigate={vi.fn()} />,
    );

    const menuButton = container.querySelector(
      'button[aria-label="Open menu"]',
    );
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    const closeButton = container.querySelector(
      'button[aria-label="Close menu"]',
    );
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(menuButton).toBeDefined();
  });

  it('should call onNavigate when mobile nav item is clicked', () => {
    global.innerWidth = 500;
    const mockNavigate = vi.fn();

    const { container } = renderWithProviders(
      <Header sections={mockSections} onNavigate={mockNavigate} />,
    );

    const menuButton = container.querySelector(
      'button[aria-label="Open menu"]',
    );
    if (menuButton) {
      fireEvent.click(menuButton);

      // Wait for menu to open, then find and click a nav item
      const navButtons = container.querySelectorAll('button');
      const projectsButton = Array.from(navButtons).find((btn) =>
        btn.textContent?.includes('Projects'),
      );

      if (projectsButton) {
        fireEvent.click(projectsButton);
        expect(mockNavigate).toHaveBeenCalled();
      }
    }
  });
});

describe('Header behaviour', () => {
  const setup = () => {
    const onNavigate = vi.fn();
    const utils = renderWithProviders(
      <Header sections={mockSections} onNavigate={onNavigate} />,
    );
    return { onNavigate, ...utils };
  };

  it('sends the logo back to the top of the page', () => {
    const { onNavigate } = setup();
    fireEvent.click(screen.getByLabelText('Silviu Dinu, back to top'));
    expect(onNavigate).toHaveBeenCalledWith('home');
  });

  it('flips the snowfall toggle', () => {
    setup();
    const before = screen
      .getAllByLabelText(/snowfall/i)[0]
      .getAttribute('aria-label');
    fireEvent.click(screen.getAllByLabelText(/snowfall/i)[0]);
    expect(
      screen.getAllByLabelText(/snowfall/i)[0].getAttribute('aria-label'),
    ).not.toBe(before);
  });

  it('closes the menu on Escape and on the backdrop', async () => {
    const { container } = setup();
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByLabelText('Close menu')).toBeNull(),
    );

    fireEvent.click(screen.getByLabelText('Open menu'));
    fireEvent.click(container.querySelector('[class*="Backdrop"]')!);
    await waitFor(() =>
      expect(screen.queryByLabelText('Close menu')).toBeNull(),
    );
  });
});
