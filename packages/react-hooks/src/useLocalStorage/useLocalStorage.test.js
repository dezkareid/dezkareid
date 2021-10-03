import { act, renderHook } from '@testing-library/react-hooks';
import useLocalStorage from '.';

describe('Test suite useLocalStorage Hook - returns and save a value in local storage', () => {
  beforeAll(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });
  it('Should return default value if key is not in local storage', () => {
    const params = { key: 'test', defaultValue: 'test-value' };
    const { result } = renderHook(() => useLocalStorage(params));
    expect(result.current.value).toEqual(params.defaultValue);
  });
  it('Should return value if key in in local storage', () => {
    const params = { key: 'test', defaultValue: 'test-value' };
    const storedValue = 'stored-value';
    localStorage.setItem(params.key, storedValue);
    const { result } = renderHook(() => useLocalStorage(params));
    expect(result.current.value).toEqual(storedValue);
  });
  it('Should save value in localStorage and update value in hook when saveValue is called', () => {
    const params = { key: 'test', defaultValue: 'test-value' };
    const { result } = renderHook(() => useLocalStorage(params));
    const updatedValue = 'updated-value';
    act(() => {
      result.current.saveValue(updatedValue);
    });
    expect(localStorage.getItem(params.key)).toEqual(updatedValue);
    expect(result.current.value).toEqual(updatedValue);
  });
});
