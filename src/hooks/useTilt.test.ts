import { act, renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';

import { useTilt } from './useTilt';

const at = (clientX: number, clientY: number) =>
  ({
    clientX,
    clientY,
    currentTarget: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
      }),
    },
  }) as unknown as MouseEvent<HTMLElement>;

describe('useTilt', () => {
  it('tilts toward the pointer and settles back when it leaves', async () => {
    const { result } = renderHook(() => useTilt(10));
    expect(result.current.style.transformPerspective).toBe(700);

    act(() => result.current.onMouseMove(at(200, 0))); // far right, top edge
    await new Promise((r) => setTimeout(r, 600));
    expect(result.current.style.rotateY.get()).toBeGreaterThan(0);
    expect(result.current.style.rotateX.get()).toBeGreaterThan(0);

    act(() => result.current.onMouseLeave());
    await new Promise((r) => setTimeout(r, 600));
    expect(Math.abs(result.current.style.rotateY.get())).toBeLessThan(0.5);
  });
});
