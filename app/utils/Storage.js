import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://192.168.68.122:5000';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
});

export { url };

export default storage;
