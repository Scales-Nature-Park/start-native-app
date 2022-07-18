import React, { useState, useLayoutEffect } from 'react';
import useSyncState from '../utils/SyncState';
import storage from '../utils/Storage';
import Entry from './Entry';
import { styles } from '../styles/EntryStyles';
import {
    Text,
    ScrollView,
    SafeAreaView,
    Image,
    TouchableOpacity,
} from 'react-native';

const PrevEntries = ({route, navigation}) => {
  const id = route.params.id;
  const entryElems = useSyncState([]);
  const [dark, setDark] = useState(true);

  useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress= {() => setDark(!dark)}>
              {
                (dark) ? <Image source={require('../assets/sun.png')} style={styles.iconImage}/> :
                          <Image source={require('../assets/moon.png')} style={styles.iconImage}/>
              }
          </TouchableOpacity>
        ),
      });
  });

  // load the data from local storage and store it in the entries state
  if (entryElems.get() && entryElems.get().length == 0) {
    storage.load({
      key: 'entries',
    }).then((local) => {        
        let fields = local.fields;
        // iterate over all entries and set an entry component
        for (let i = fields.length - 1; i >= 0 ; i--) {
          entryElems.set([...entryElems.get(), <Entry data={fields[i]} onPress={() => {
            navigation.navigate('DataEntry', {...route.params, data: fields[i]});
          }}/>]);
        } 
        if (entryElems.get().length == 0) entryElems.set([<Text style={styles.emptyText}>No Entries Found.</Text>]);
    }).catch((err) => {
        entryElems.set(undefined);
    });
  }

  return (
    <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
      <ScrollView>
        {(entryElems.get()) ? entryElems.get() : 
        <Text style={(dark) ? styles.emptyTextDark : styles.emptyText}>No Entries Found.</Text>}
      </ScrollView>
    </SafeAreaView>
  );  
};

export default PrevEntries;