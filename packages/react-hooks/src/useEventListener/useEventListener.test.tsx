import { renderHook, act } from '@testing-library/react';
import useEventListener from '.';
import { vi } from 'vitest';

describe('Test suite useEventListener hook - add and remove event listener from object', () => {
  it('Should register event on object, when event happen should execute callback and when is unmounted should remove registration', () => {
    const customEvent = 'customEvent';
    const callback = vi.fn();
    const params = { element: window, event: customEvent, callback };
    const { unmount } = renderHook(() => useEventListener(params));
    const event = new CustomEvent(customEvent);
    act(() => {
      window.dispatchEvent(event);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    const onRemoveEventSpy = vi.spyOn(window, 'removeEventListener');
    act(() => {
      unmount();
    });
    expect(onRemoveEventSpy).toHaveBeenCalled();
  });
});
