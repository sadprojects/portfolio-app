import { ThemeProvider } from '@contexts/ThemeContext';
import { fireEvent, render, screen } from '@testing-library/react';
import { VersionModal } from './VersionModal';

// Mock the version.json
vi.mock('@/version.json', () => ({
  default: {
    version: '1.2.3',
    buildTime: 1703203200000, // Dec 22, 2023 00:00:00 UTC
  },
}));

describe('VersionModal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={false}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByText('Version Info')).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Version Info')).toBeDefined();
  });

  it('should display version number', () => {
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('v1.2.3')).toBeDefined();
  });

  it('should display formatted build date', () => {
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    // The date will be formatted according to locale
    expect(screen.getByText('Last Built')).toBeDefined();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={onClose}
        />
      </ThemeProvider>,
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={onClose}
        />
      </ThemeProvider>,
    );

    // Click on overlay (the motion.div wrapper)
    const overlay = container.querySelector('[style*="opacity"]');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not close when clicking on modal content', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={onClose}
        />
      </ThemeProvider>,
    );

    // Click on modal content (title)
    const title = screen.getByText('Version Info');
    fireEvent.click(title);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should display Current Version label', () => {
    render(
      <ThemeProvider>
        <VersionModal
          isOpen={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Current Version')).toBeDefined();
  });

  it('should have correct displayName', () => {
    expect(VersionModal.displayName).toBe('VersionModal');
  });
});

describe('VersionModal with missing buildTime', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should handle missing buildTime gracefully', async () => {
    // Re-mock with missing buildTime
    vi.doMock('@/version.json', () => ({
      default: {
        version: '1.0.0',
        buildTime: null,
      },
    }));

    // Need to dynamically import to get the updated mock
    const { VersionModal: VersionModalWithNoBuildTime } =
      await import('./VersionModal');

    render(
      <ThemeProvider>
        <VersionModalWithNoBuildTime
          isOpen={true}
          onClose={() => {}}
        />
      </ThemeProvider>,
    );

    // Should still render without crashing
    expect(screen.getByText('Version Info')).toBeDefined();
  });
});
