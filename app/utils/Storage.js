import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'https://start-data-server.herokuapp.com';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

export { url };

export default storage;
