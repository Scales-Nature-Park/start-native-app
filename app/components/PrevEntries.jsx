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
  const entryElems = useSyncState(undefined);
  const [dark, setDark] = useState(true);
  const [rerender, setRerender] = useState(true);

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
  if (!entryElems.get() || rerender) {
    storage.load({
      key: 'entries',
    }).then(local => {        
        let fields = local.fields;
        let localEntryElems = [];

        // iterate over all entries and set an entry component
        for (let i = fields.length - 1; i >= 0 ; i--) {
          localEntryElems = [...localEntryElems, <Entry data={fields[i]} allEntries={[...fields]} onPress={() => {
            navigation.navigate('DataEntry', {...route.params, data: fields[i]});
          }} setRerender={setRerender} />];
        } 
        entryElems.set([...localEntryElems]);

        if (rerender) setRerender(false);
    }).catch(err => {
        entryElems.set(undefined);
    });
  }

  return (
    <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
      <ScrollView>
        {(entryElems.get()?.length > 0) ? entryElems.get() : 
        <Text style={(dark) ? styles.emptyTextDark : styles.emptyText}>No Entries Found.</Text>}
      </ScrollView>
    </SafeAreaView>
  );  
};

export default PrevEntries;