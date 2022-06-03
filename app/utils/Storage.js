import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://10.0.0.227:5000';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

export { url };

export default storage;
