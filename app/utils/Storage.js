import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext } from 'react';

const config = require('./json/config.json');

const url = config.server;

const UserContext = createContext();

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

/**
 * Function for checking whether to arrays are equal or not, it returns true if they're
 * equal, false otherwise.
 */
const ArrayEquals = (array1, array2, json = false) => {
  if (!array1 || !array2) return false;

  if (json) return array1.length === array2.length &&
      array1.every((elem, index) => JSON.stringify(elem) === JSON.stringify(array2[index]));
  
  return array1.length == array2.length &&
    array1.every((elem, index) => elem === array2[index]);
};

export { url, ArrayEquals, UserContext };

export default storage;
