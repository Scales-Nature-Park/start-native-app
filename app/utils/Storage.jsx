import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext } from 'react';

const url = 'http://192.168.2.68:5000';

const UserContext = createContext();

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

const ArrayEquals = (array1, array2, json = false) => {
  if (!array1 || !array2) return false;

  if (json) return array1.length === array2.length &&
      array1.every((elem, index) => JSON.stringify(elem) === JSON.stringify(array2[index]));
  
  return array1.length == array2.length &&
    array1.every((elem, index) => elem === array2[index]);
};

export { url, ArrayEquals, UserContext };

export default storage;
