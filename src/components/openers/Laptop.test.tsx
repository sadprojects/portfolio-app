import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen, waitFor } from '@testing-library/react';
import { motionValue } from 'framer-motion';

import { LaptopFrame } from './Laptop';

describe('LaptopFrame', () => {
  it('keeps its mask until the screen is covered, and folds the lid by its angle', async () => {
    const screenOff = motionValue(0);
    const lidAngle = motionValue(0);
    const { container } = render(
      <ThemeProvider>
        <LaptopFrame lidAngle={lidAngle} screenCovered={screenOff}>
          <p>On screen</p>
        </LaptopFrame>
      </ThemeProvider>,
    );
    const shell = container.firstElementChild!;
    const [mask, lid] = [...shell.children] as HTMLElement[];
    expect(lid).toContainElement(screen.getByText('On screen'));
    expect(mask).toHaveStyle({ visibility: 'visible' });

    screenOff.set(0.5);
    lidAngle.set(-40);
    await waitFor(() =>
      expect(lid.style.transform).toContain('rotateX(-40deg)'),
    );
    expect(mask).toHaveStyle({ visibility: 'visible' });

    screenOff.set(1);
    await waitFor(() => expect(mask).toHaveStyle({ visibility: 'hidden' }));
  });

  it('stays lit and open with no angles given', () => {
    const { container } = render(
      <ThemeProvider>
        <LaptopFrame>
          <p>Line</p>
        </LaptopFrame>
      </ThemeProvider>,
    );
    const [mask, lid] = [
      ...container.firstElementChild!.children,
    ] as HTMLElement[];
    expect(mask).toHaveStyle({ visibility: 'visible' });
    expect(lid.style.transform).not.toContain('rotateX');
    expect(lid.querySelectorAll('div')).toHaveLength(1);
  });
});
