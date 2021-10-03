import { useEffect } from 'react';

function useEventListener({ element, event, callback }) {
  useEffect(() => {
    element.addEventListener(event, callback);
    return () => {
      element.removeEventListener(event, callback);
    };
  }, [element, event, callback]);
}

export default useEventListener;
