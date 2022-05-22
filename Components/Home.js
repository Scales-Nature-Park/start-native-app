import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
} from 'react-native';

const scalesColors = require('../colors.json');
const dataImage = require('../assets/5710446.jpg');
console.log(dataImage);

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
        <TouchableOpacity style={styles.buttonView}
        onPress= {() => {
            navigation.navigate('DataEntry');
        }}>
            <ImageBackground source={dataImage}></ImageBackground>
            <Text styles={styles.buttonText}>Data Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonView}
        onPress= {() => {

        }}>
            <Text styles={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style= {styles.buttonView}
        onPress= {() => {
        }}>
            <Text styles={styles.buttonText}>Previous Entries</Text>
        </TouchableOpacity>

        <TouchableOpacity style= {styles.buttonView}
        onPress= {() => {
        }}>
            <Text styles={styles.buttonText}>Account</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    buttonView: {
        width: '85%',
        borderRadius: 10,
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: scalesColors.DeepGreen,
    },

    buttonText: {

    },

    safeArea: {
        flex: 1,
        padding: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#fff',    
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'column',
        width: '100%',
        height: 50,
        marginTop: 20,
      },
});

export default Home;
