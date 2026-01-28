import { useEffect } from 'react';

interface UseEventListenerParams {
  element: EventTarget;
  event: string;
  callback: EventListener;
}

function useEventListener({ element, event, callback }: UseEventListenerParams) {
  useEffect(() => {
    element.addEventListener(event, callback);
    return () => {
      element.removeEventListener(event, callback);
    };
  }, [element, event, callback]);
}

export default useEventListener;
