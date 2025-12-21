import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import useClickOutside from './useClickOutside';

const TestComponent = ({ handler }: { handler: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, handler);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <div data-testid="outside">Outside</div>
    </div>
  );
};

describe('useClickOutside', () => {
  it('should call handler when clicking outside', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent handler={handler} />);

    fireEvent.mouseDown(getByTestId('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when clicking inside', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent handler={handler} />);

    fireEvent.mouseDown(getByTestId('inside'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle touch events', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent handler={handler} />);

    fireEvent.touchStart(getByTestId('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listeners on unmount', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<TestComponent handler={handler} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
