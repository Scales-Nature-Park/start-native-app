import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const Entry = ({data, onPress}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.panelText}>{data.category} Entry</Text>
            <Text style={styles.panelText}>{data.day}/{data.month}/{data.year} at {data.hours}:{data.mins}</Text>
        </TouchableOpacity>
    );   
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        backgroundColor: '#fff',
        borderColor: '#E6EAF0',
        borderWidth: 2.5,
        borderRadius: 10,
        margin: '2%',
        padding: '7%',
        backgroundColor: scalesColors.DeepGreen,
    },
    
    panelText: {
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
    }
});

export default Entry;