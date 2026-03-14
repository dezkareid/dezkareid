interface UseLocalStorageParameters<T> {
    key: string;
    defaultValue: T;
}
interface UseLocalStorageReturn<T> {
    value: T;
    saveValue: (newValue: T) => void;
}
declare function useLocalStorage<T>({ key, defaultValue }: UseLocalStorageParameters<T>): UseLocalStorageReturn<T>;
export default useLocalStorage;
