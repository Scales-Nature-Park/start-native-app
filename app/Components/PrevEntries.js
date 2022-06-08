import React, { useState } from 'react';
import useSyncState from '../utils/SyncState';
import storage from '../utils/Storage';
import Entry from './Entry';
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const PrevEntries = ({route, navigation}) => {
  const id = route.params.id;
  const entryElems = useSyncState([]);
  const [dark, setDark] = useState(true);

  React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress= {() => setDark(!dark)}>
              {
                  // (dark) ? <Image source={photo} style={styles.image}/> :
                  //          <Image source={photo} style={styles.image}/>
              }
              <Text>Dark Mode</Text>
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
      <View style={styles.overlay}/>
      <ScrollView>
        {(entryElems.get()) ? entryElems.get() : 
        <Text style={(dark) ? styles.emptyTextDark : styles.emptyText}>No Entries Found.</Text>}
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

  safeAreaDark: {
    flex: 1,
    paddingTop: StatusBar.currentHeight * 70 / 100,
    paddingBottom: StatusBar.currentHeight * 70 / 100,
    backgroundColor: '#121212',    
  },

  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.07,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
},

  emptyText: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },

  emptyTextDark: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  }
});

export default PrevEntries;