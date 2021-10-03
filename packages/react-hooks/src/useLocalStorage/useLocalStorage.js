import { useCallback, useEffect, useState } from 'react';

function useLocalStorage({ key, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    if (key) {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        setValue(storedValue);
      }
    }
  }, [key]);
  const saveValue = useCallback(
    newValue => {
      localStorage.setItem(key, newValue);
      setValue(newValue);
    },
    [key]
  );
  return { value, saveValue };
}

export default useLocalStorage;
