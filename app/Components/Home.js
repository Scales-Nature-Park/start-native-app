import React, { useState } from 'react';
import storage from './Storage';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

const scalesColors = require('../colors.json');

const Home = ({route, navigation}) => {
    var id = route.params.id;
    
    // offline mode tries to retrieve login info from local
    // storage, returns to login form on fail
    if (route.params.offlineMode) {
        storage.load({
            key: 'loginState',
        }).then((local) => {
            id = local.id;
            console.log('Loaded local user data.');
        }).catch((err) => {
            Alert.alert("ERROR", err.message);
            navigation.navigate('LoginForm');
        });
    }
    
    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonView}
            onPress= {() => {
                navigation.navigate('DataEntry', route.params);
            }}>
                <Text styles={styles.buttonText}>Data Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonView}
            onPress= {() => {

            }}>
                <Text styles={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity style= {styles.buttonView}
            onPress= {() => {
                navigation.navigate('PrevEntries', route.params);
            }}>
                <Text styles={styles.buttonText}>Saved Entries</Text>
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
