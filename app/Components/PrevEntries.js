import React, { useState } from 'react';
import axios from 'axios';
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
const url = 'http://10.0.0.227:5000';

const PrevEntries = ({route, navigation}) => {
    const id = route.params.id;

    return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
       
      </ScrollView>
      </SafeAreaView>
    );   
};


const styles = StyleSheet.create({

});

export default PrevEntries;