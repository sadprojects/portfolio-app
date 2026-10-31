import { ThemeProvider } from '@contexts/ThemeContext';
import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'framer-motion';

import { ScrollFrame } from './ScrollFrame';

const renderFrame = (anchor?: 'centre' | 'bottom') =>
  render(
    <ThemeProvider>
      <ScrollFrame
        id="projects"
        width="100rem"
        aspect={2}
        cutout={{ left: 10, top: 10, width: 80, height: 60 }}
        tone="background"
        anchor={anchor}
        start={2}
        artwork={(startupOpacity) => (
          <motion.p style={{ opacity: startupOpacity }}>Frame line</motion.p>
        )}
      >
        <button type="button">Inside</button>
      </ScrollFrame>
    </ThemeProvider>,
  );

const trackVariables = (container: HTMLElement) => {
  const track = container.querySelector<HTMLElement>(
    '[data-section="projects"]',
  )!;
  return (name: string) => track.style.getPropertyValue(name);
};

// The artwork is 50rem tall; its cutout runs from 10% to 70% of that.
const CUTOUT_TOP =
  'calc((100vh - calc(100rem / 2)) / 2 + calc(100rem / 2) * 0.1)';
const CUTOUT_BOTTOM =
  'calc((100vh - calc(100rem / 2)) / 2 + calc(100rem / 2) * 0.7)';

describe('ScrollFrame', () => {
  it('pins the artwork over the section and sizes the section to the cutout', () => {
    const { container } = renderFrame();
    const track = container.querySelector('[data-section="projects"]')!;
    expect(track).toContainElement(screen.getByText('Frame line'));
    expect(track).toContainElement(screen.getByRole('button'));
    const variable = trackVariables(container);
    expect(variable('--shift')).toBe('0px');
    expect(variable('--cutout-width')).toBe('calc(100rem * 0.8)');
    expect(variable('--arrive')).toBe(
      `min(100vh, calc(0px + ${CUTOUT_BOTTOM}))`,
    );
    expect(variable('--depart')).toBe(
      `calc(200vh - max(0px, calc(0px + ${CUTOUT_TOP})))`,
    );
  });

  it('pushes a bottom-anchored artwork down until its cutout meets the viewport bottom', () => {
    const { container } = renderFrame('bottom');
    const variable = trackVariables(container);
    const shift = `calc(100vh - ${CUTOUT_BOTTOM})`;
    expect(variable('--shift')).toBe(shift);
    expect(variable('--arrive')).toBe(
      `min(100vh, calc(${shift} + ${CUTOUT_BOTTOM}))`,
    );
  });

  it('scrolls a keyboard-focused control into the cutout, leaving pointer focus alone', () => {
    renderFrame();
    const button = screen.getByRole('button');
    const matches = vi.spyOn(button, 'matches');
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    scrollIntoView.mockClear();

    matches.mockReturnValue(false);
    fireEvent.focus(button);
    expect(scrollIntoView).not.toHaveBeenCalled();

    matches.mockReturnValue(true);
    fireEvent.focus(button);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
  });
});
