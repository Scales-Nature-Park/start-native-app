import React from 'react';
import Entry from './Entry';
import axios from 'axios';
import useSyncState, { url } from '../utils/SyncState';
import { styles } from '../styles/EntryStyles';
import { Text, Alert } from 'react-native';

const PrevEntries = ({ params, setScreen }) => {
  const entryElems = useSyncState([]);

  // load all entries from the database and display them in recent entries part
  // of the dashboard
  if (entryElems.get() && entryElems.get().length == 0) {
    axios({
      method: 'get',
      url: url + '/search',
      params: {}
    }).then(response => {
      // display list of entries 
      let entries = [];
      for (let i = response.data.length - 1; i >= 0; i--) {
            entries = [...entries, <Entry data={response.data[i]} onPress={() => {
                setScreen({val: 'DataEntry', params: response.data[i]});
            }}/>];
        }

        (entries.length > 0) ? entryElems.set(entries) : entryElems.set([<Text style={styles.emptyTextDark}>No Entries Found.</Text>]);;
    }).catch(error => {
        Alert.alert('ERROR', error?.response?.data || error.message);
    });
  }

  return (
      (entryElems.get()) ? entryElems.get() : 
      <Text style={styles.emptyTextDark}>No Entries Found.</Text>
  );  
};

export default PrevEntries;