interface UseEventListenerParameters {
    element: EventTarget;
    event: string;
    callback: EventListener;
}
declare function useEventListener({ element, event, callback }: UseEventListenerParameters): void;
export default useEventListener;
