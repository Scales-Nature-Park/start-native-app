import axios from 'axios';
import storage, { url, ArrayEquals } from './Storage';
import { Alert } from 'react-native';

const dataFields = require('./fields.json');

/**
 * Asynchronous function that fetches data fields from the server and compares
 * them with local fields then prompts the user to download the "update" or skip it
 * for now.
 */
const FetchFields = async () => {
  try {
    let fields = [];
    let localFields = [];
    
    // fetch data fields from the database
    try {
      let res = await axios({
        method: 'get',
        url: url + '/fields'
      });
      
      if (res?.data?.length > 0) fields = res.data;
      else fields = undefined;
    } catch (err) {
      fields = undefined;
    }
    
    // fetch local data fields from local mobile storage
    try {
      localFields = await storage.load({key: 'fields'});
    } catch (err) {
      // use fields.json if local data isn't found
      localFields = [...dataFields];
    }

    if (fields == undefined || ArrayEquals(localFields, fields, true)) return;
    
    // prompt user to download updated fields or skip download for now
    Alert.alert('New Update', 'A new update is currently available for download.', [
      {
        text: 'Remind Me Later',
        onPress: () => {}
      },
      {
        text: 'Download Now',
        onPress: () => {
          storage.save({
            key: 'fields',
            data: fields
          });
        }
      }
    ]);
  } catch (err) {}
};

export { FetchFields };