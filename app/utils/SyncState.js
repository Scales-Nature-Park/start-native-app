import { useState } from 'react';

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