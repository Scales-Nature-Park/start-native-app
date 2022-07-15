import { useState } from 'react';

const url = 'https://start-data-server.herokuapp.com';

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