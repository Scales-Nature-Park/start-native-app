import React, { useState, useContext, useLayoutEffect } from 'react';
import useSyncState from '../utils/SyncState';
import storage, { UserContext } from '../utils/Storage';
import Entry from './Entry';
import { styles } from '../styles/EntryStyles';
import {
    Text,
    ScrollView,
    SafeAreaView,
    Image,
    TouchableOpacity,
} from 'react-native';

const PrevEntries = ({ navigation }) => {
  const entryElems = useSyncState(undefined);
  const user = useContext(UserContext);
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
        let fields = [...local.fields];
        let localEntryElems = [];

        if (user?.userInfo?.sharedEntries?.length) fields = [...fields, ...user?.userInfo?.sharedEntries];

        // iterate over all entries and set an entry component
        for (let i = fields.length - 1; i >= 0 ; i--) {
          localEntryElems = [...localEntryElems, <Entry data={fields[i]} allEntries={[...fields]} onPress={() => {
            navigation.navigate('DataEntry', {data: fields[i]});
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