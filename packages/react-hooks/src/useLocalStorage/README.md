# useLocalStorage

This hook allows you interact with localStorage to retrieve or update a value

## Usage
```js
  import { useLocalStorage } from '@dezkareid/react-hooks';

  const { value } = useLocalStorage({ key: 'notexist', defaultValue: 'default value' });
```