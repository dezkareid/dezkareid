import { useCallback, useEffect, useState } from 'react';

interface UseLocalStorageParams<T> {
  key: string;
  defaultValue: T;
}

interface UseLocalStorageReturn<T> {
  value: T;
  saveValue: (newValue: T) => void;
}

function useLocalStorage<T>({ key, defaultValue }: UseLocalStorageParams<T>): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => {
    if (key) {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        try {
          setValue(JSON.parse(storedValue));
        } catch (error) {
          setValue(storedValue as T);
        }
      }
    }
  }, [key]);
  const saveValue = useCallback(
    (newValue: T) => {
      if (typeof newValue === 'object' && newValue !== null) {
        localStorage.setItem(key, JSON.stringify(newValue));
      } else {
        localStorage.setItem(key, String(newValue));
      }
      setValue(newValue);
    },
    [key]
  );
  return { value, saveValue };
}

export default useLocalStorage;
