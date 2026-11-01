import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';

import { MenuBar } from './MenuBar';

describe('MenuBar', () => {
  it('shows the app menus and the current date and time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 1, 12, 58));
    render(
      <ThemeProvider>
        <MenuBar />
      </ThemeProvider>,
    );
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText(/Sun 1 Nov/)).toHaveTextContent('12:58');
    vi.useRealTimers();
  });
});
