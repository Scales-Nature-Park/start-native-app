import { useState } from 'react';

const url = 'http://10.0.0.227:5000';

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

export { url };
export default useSyncState;