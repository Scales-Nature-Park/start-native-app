import React, { useState } from 'react';
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
const Entry = ({data}) => {
    console.log(data);
    return (
        <View style={styles.container}>
            <Text>{data.month} Hello</Text>
        </View>
    );   
};


const styles = StyleSheet.create({
    container: {
        width: '95%',
        backgroundColor: '#fff',
    }
});

export default Entry;