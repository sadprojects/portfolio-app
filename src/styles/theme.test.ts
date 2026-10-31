import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { theme } from './theme';

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio between two hex colours. */
const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

/* Guards the look: palette, type and the fonts the page ships. */
describe('theme', () => {
  it('matches the approved palette and type', () => {
    expect(theme).toMatchSnapshot();
  });

  it('offers the same tokens in light and dark', () => {
    expect(Object.keys(theme.dark.colors)).toEqual(
      Object.keys(theme.light.colors),
    );
    expect(Object.keys(theme.dark.shadows)).toEqual(
      Object.keys(theme.light.shadows),
    );
  });

  it.each(['light', 'dark'] as const)(
    'keeps %s-mode text readable (WCAG AAA body, AA secondary)',
    (mode) => {
      const { background, foreground, secondary } = theme[mode].colors;
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(7);
      expect(contrast(secondary, background)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('ships every web font the page names', () => {
    const html = readFileSync(resolve('index.html'), 'utf8');
    ['Inter', 'Instrument Serif', 'Caveat'].forEach((family) => {
      expect(html).toContain(`font-family: '${family}'`);
    });
    expect(theme.typography.fonts.display).toContain('Instrument Serif');
    expect(theme.typography.fonts.hand).toContain('Caveat');
    const files = [...html.matchAll(/url\(\/fonts\/([^)]+)\)/g)].map(
      (m) => m[1],
    );
    expect(files.length).toBeGreaterThan(0);
    files.forEach((file) => {
      expect(existsSync(resolve('public/fonts', file))).toBe(true);
    });
  });
});
