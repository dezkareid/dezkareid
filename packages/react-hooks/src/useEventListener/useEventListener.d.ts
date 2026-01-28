interface UseEventListenerParams {
    element: EventTarget;
    event: string;
    callback: EventListener;
}
declare function useEventListener({ element, event, callback }: UseEventListenerParams): void;
export default useEventListener;
