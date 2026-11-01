import { contextLine, exposureLine, playbackIndex } from './cameraPlayback';

describe('cameraPlayback', () => {
  it('holds the first photo until playback starts, then steps through them', () => {
    expect(playbackIndex(0, 0.4, 5)).toBe(0);
    expect(playbackIndex(0.4, 0.4, 5)).toBe(0);
    expect(playbackIndex(0.7, 0.4, 5)).toBe(2);
    expect(playbackIndex(1, 0.4, 5)).toBe(4);
    expect(playbackIndex(0.55, 0.4, 5)).toBeCloseTo(1, 5);
  });

  it('prints only the shot data that is known', () => {
    expect(exposureLine({ aperture: 'ƒ/2.8', iso: 100 })).toBe(
      'ƒ/2.8 · ISO 100',
    );
    expect(exposureLine(undefined)).toBe('');
    expect(contextLine({ camera: 'Nikon D3500', date: 'Dec 2020' })).toBe(
      'Nikon D3500 · Dec 2020',
    );
  });
});
