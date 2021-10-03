# useEventListener

This hook allows you add event listener to object. The object must implement addEventListener and removeEventListener methods

## Usage
```js
  import { useEventListener } from '@dezkareid/react-hooks';
  
  const callback = useCallback(() => {});
  const { value } = useEventListener({ element: window, event: 'close', callback });
```