import { genieOutline, genieSlice } from './genieSlice';

const origin = { x: 0.77, y: 0.95, width: 0.06 };
const tops = [0, 0.25, 0.5, 0.75, 0.975];
const numbers = (polygon: string) =>
  polygon.match(/-?[\d.e-]+(?=%)/g)!.map(Number);

describe('genieSlice', () => {
  it('is the whole window once open', () => {
    tops.forEach((top) => {
      expect(genieSlice(1, top, origin)).toEqual({
        x: 0,
        y: top,
        scaleX: 1,
        scaleY: 1,
      });
    });
  });

  it('starts folded into the icon', () => {
    tops.forEach((top) => {
      const slice = genieSlice(0, top, origin);
      expect(slice.scaleX).toBeCloseTo(origin.width);
      expect(slice.x + slice.scaleX / 2).toBeCloseTo(origin.x);
      expect(slice.y).toBeCloseTo(origin.y);
      expect(slice.scaleY).toBe(0);
    });
  });

  it('rises from the icon top first, bottom still pinched into it', () => {
    const top = genieSlice(0.4, 0, origin);
    const bottom = genieSlice(0.4, 0.975, origin);
    expect(top.y).toBeLessThan(0.3);
    expect(top.scaleX).toBeGreaterThan(0.6);
    expect(bottom.scaleX).toBeLessThan(0.15);
    expect(bottom.x + bottom.scaleX / 2).toBeCloseTo(origin.x, 1);
  });
});

describe('genieOutline', () => {
  it('spans the whole window once open', () => {
    const points = numbers(genieOutline(1, origin));
    const xs = points.filter((_, index) => index % 2 === 0);
    const ys = points.filter((_, index) => index % 2 === 1);
    expect(Math.min(...xs)).toBeCloseTo(0);
    expect(Math.max(...xs)).toBeCloseTo(100);
    expect(Math.min(...ys)).toBeCloseTo(0);
    expect(Math.max(...ys)).toBeCloseTo(100);
  });

  it('sits on the icon before it opens', () => {
    const points = numbers(genieOutline(0, origin));
    const xs = points.filter((_, index) => index % 2 === 0);
    const ys = points.filter((_, index) => index % 2 === 1);
    expect(Math.min(...xs)).toBeCloseTo((origin.x - origin.width / 2) * 100);
    expect(Math.max(...xs)).toBeCloseTo((origin.x + origin.width / 2) * 100);
    ys.forEach((y) => expect(y).toBeCloseTo(origin.y * 100));
  });
});
