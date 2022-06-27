import React from 'react';
import Entry from './Entry';
import axios from 'axios';
import useSyncState, { url } from '../utils/SyncState';
import { styles } from '../styles/EntryStyles';
import { Text } from 'react-native';

const PrevEntries = () => {
  const entryElems = useSyncState([]);

  // load all entries from the database and display them in recent entries part
  // of the dashboard
  if (entryElems.get() && entryElems.get().length == 0) {
    axios({
      method: 'get',
      url: url + '/search',
      params: {}
    }).then((response) => {
        let entries = [];
        // display list of entries 
        for (let i = response.data.length - 1; i >= 0; i--) {
            entries = [...entries, <Entry data={response.data[i]} onPress={() => {
                // navigation.navigate('DataEntry', {...route.params, data: response.data[i], search: true});
                console.log(entryElems.get());
            }}/>];
        }

        (entries.length > 0) ? entryElems.set(entries) : entryElems.set([<Text style={styles.emptyTextDark}>No Entries Found.</Text>]);;
    }).catch((error) => {
        console.log(error.message);
        Alert.alert('ERROR', error.message);
    });
  }

  return (
      (entryElems.get()) ? entryElems.get() : 
      <Text style={styles.emptyTextDark}>No Entries Found.</Text>
  );  
};

export default PrevEntries;