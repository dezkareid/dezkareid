import { useCallback, useState } from 'react';

interface UseLocalStorageParameters<T> {
  key: string;
  defaultValue: T;
}

interface UseLocalStorageReturn<T> {
  value: T;
  saveValue: (newValue: T) => void;
}

function useLocalStorage<T>({ key, defaultValue }: UseLocalStorageParameters<T>): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(() => {
    if (!key) return defaultValue;
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return storedValue as T;
    }
  });
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
