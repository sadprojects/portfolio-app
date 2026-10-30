import { ThemeProvider } from '@contexts/ThemeContext';
import { render } from '@testing-library/react';
import { SectionSkeleton } from './SectionSkeleton';

describe('SectionSkeleton', () => {
  it('renders a title bar and three placeholder cards', () => {
    const { container } = render(
      <ThemeProvider>
        <SectionSkeleton />
      </ThemeProvider>,
    );
    expect(container.querySelector('section')).not.toBeNull();
    expect(container.querySelectorAll('section > div > div')).toHaveLength(3);
  });
});
