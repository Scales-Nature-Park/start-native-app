import { useState } from 'react';

/**
 * React state wrapper function that simulates a synchronous state. It keeps a 
 * state and current value that is updated on set function call. The get function
 * returns current instead of the state value. An object of both functions is returned.
 */
function useSyncState(init) {
   const [state, setState] = useState(init);

   let current = state;

   const get = () => current;

   const set = newValue => {
      current = newValue;
      setState(newValue);
      return current;
   }

   return {
      get,
      set,
   }
}

export default useSyncState;