import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { entryStyles } from '../styles/EntryStyles';

const Entry = ({data, onPress}) => {
    return (
        <TouchableOpacity style={entryStyles.container} onPress={onPress}>
            <Text style={entryStyles.panelText}>{data.category} Entry</Text>
            <Text style={entryStyles.panelText}>{data.day}/{data.month}/{data.year} at {data.hours}:{data.mins}</Text>
        </TouchableOpacity>
    );   
};

export default Entry;