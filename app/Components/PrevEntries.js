import React, { useState } from 'react';
import useSyncState from '../utils/SyncState';
import storage from '../utils/Storage';
import Entry from './Entry';
import {
    StatusBar,
    StyleSheet,
    Text,
    ScrollView,
    SafeAreaView,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const PrevEntries = ({route, navigation}) => {
  const id = route.params.id;
  const entryElems = useSyncState([]);

  // load the data from local storage and store it in the entries state
  if (entryElems.get().length == 0) {
    storage.load({
      key: 'entries',
    }).then((local) => {        
        // iterate over all entries and set an entry component
        for (let entry of local.fields.reverse()) {
          entryElems.set([...entryElems.get(), <Entry data={entry} onPress={() => {
            navigation.navigate('DataEntry', {data: entry});
          }}/>]);
        } 
        if (entryElems.get().length == 0) entryElems.set([<Text style={styles.emptyText}>No Entries Found.</Text>]);
    }).catch((err) => {
        entryElems.set([<Text style={styles.emptyText}>No Entries Found.</Text>]);
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView>
      {entryElems.get()}
    </ScrollView>
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight * 70 / 100,
    paddingBottom: StatusBar.currentHeight * 70 / 100,
    backgroundColor: '#fff',    
  },

  emptyText: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  }
});

export default PrevEntries;