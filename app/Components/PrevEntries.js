import React, { useState } from 'react';
import axios from 'axios';
import storage, { url } from './Storage';
import Entry from './Entry';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollViewBase,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';

const scalesColors = require('../colors.json');

const PrevEntries = ({route, navigation}) => {
    const id = route.params.id;
    const [entries, setEntries] = useState([]);

    // load the data from local storage and store it in the entries state
    storage.load({
      key: 'entries',
    }).then((local) => {
        setEntries(local.fields);
    }).catch((err) => {
        Alert.alert("Failure", err.message);
    });
    
    // iterate over all entries and set an entry component
    let entryElems = [];
    for (let entry of entries) {
      entryElems.push(<Entry data={entry} />);
    }

    return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {entryElems}
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
  }
});

export default PrevEntries;