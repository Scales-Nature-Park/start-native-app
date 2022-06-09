import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../utils/SyncState'
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const Dashboard = ({ navigation }) => {
    console.log('hola');
    navigation.navigate('Login');
    return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <TouchableOpacity style={styles.buttonView} onPress={() => {
          console.log('trying');
          navigation.navigate('Login');
        }}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight * 70 / 100,
    paddingBottom: StatusBar.currentHeight * 70 / 100,
    backgroundColor: '#fff',    
  },

  buttonView: { 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121221'
  }
});


export default Dashboard;