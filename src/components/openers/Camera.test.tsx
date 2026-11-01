import { ThemeProvider } from '@contexts/ThemeContext';
import { render, screen } from '@testing-library/react';

import { Camera } from './Camera';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motion.reduce,
}));

const intro = { label: 'Off the clock', text: 'A camera and a controller.' };
const photos = [
  {
    image: 'a.jpg',
    caption: 'First',
    alt: 'A',
    exif: {
      camera: 'Nikon D3500',
      aperture: 'ƒ/2.8',
      shutter: '1/250 s',
      iso: 100,
      focal: '35 mm',
      date: 'Dec 2020',
      location: 'Bușteni, Romania',
    },
  },
  { image: 'b.jpg', caption: 'Second', alt: 'B' },
  { image: 'c.jpg', alt: 'C' },
];

const renderCamera = () =>
  render(
    <ThemeProvider>
      <Camera intro={intro} photos={photos} />
    </ThemeProvider>,
  );

describe('Camera', () => {
  beforeEach(() => {
    motion.reduce = false;
  });

  it('loads every photo into the camera screen behind the section line', () => {
    const { container } = renderCamera();
    expect(
      container.querySelector('img[src="/media/images/camera.webp"]'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('img').map((img) => img.getAttribute('alt')),
    ).toEqual(['A', 'B', 'C']);
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(
      screen.getByText('ƒ/2.8 · 1/250 s · ISO 100 · 35 mm'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nikon D3500 · Bușteni, Romania · Dec 2020'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(intro.text)).toHaveLength(1);
  });

  it('falls back to plain photo blocks under reduced motion', () => {
    motion.reduce = true;
    renderCamera();
    expect(screen.getAllByTestId('media-block')).toHaveLength(photos.length);
    expect(screen.getByText(intro.text)).toBeInTheDocument();
    expect(screen.queryByText('1/3')).toBeNull();
  });
});
