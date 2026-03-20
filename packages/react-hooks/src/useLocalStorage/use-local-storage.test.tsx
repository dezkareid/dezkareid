import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '.';

describe('Test suite useLocalStorage Hook - returns and save a value in local storage', () => {
  beforeAll(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });
  it('Should return default value if key is not in local storage', () => {
    const parameters = { key: 'test', defaultValue: 'test-value' };
    const { result } = renderHook(() => useLocalStorage(parameters));
    expect(result.current.value).toEqual(parameters.defaultValue);
  });
  it('Should return value if key in in local storage', () => {
    const parameters = { key: 'test', defaultValue: 'test-value' };
    const storedValue = 'stored-value';
    localStorage.setItem(parameters.key, storedValue);
    const { result } = renderHook(() => useLocalStorage(parameters));
    expect(result.current.value).toEqual(storedValue);
  });
  it('Should save value in localStorage and update value in hook when saveValue is called', () => {
    const parameters = { key: 'test', defaultValue: 'test-value' };
    const { result } = renderHook(() => useLocalStorage(parameters));
    const updatedValue = 'updated-value';
    act(() => {
      result.current.saveValue(updatedValue);
    });
    expect(localStorage.getItem(parameters.key)).toEqual(updatedValue);
    expect(result.current.value).toEqual(updatedValue);
  });
});
