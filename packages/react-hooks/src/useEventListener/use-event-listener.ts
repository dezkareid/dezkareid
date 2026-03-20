import { useEffect } from 'react';

interface UseEventListenerParameters {
  element: EventTarget;
  event: string;
  callback: EventListener;
}

function useEventListener({ element, event, callback }: UseEventListenerParameters) {
  useEffect(() => {
    element.addEventListener(event, callback);
    return () => {
      element.removeEventListener(event, callback);
    };
  }, [element, event, callback]);
}

export default useEventListener;
