import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { entryStyles } from '../styles/EntryStyles';
import storage from '../utils/Storage';

Feather.loadFont();

const Entry = ({data, allEntries, onPress, setRerender}) => {
    return (
        <TouchableOpacity style={entryStyles.container} onPress={onPress}>
            <Text style={entryStyles.panelText}>{data.category} Entry</Text>
            <Text style={entryStyles.panelText}>{data.day}/{data.month}/{data.year} at {data.hours}:{data.mins}</Text>
            {(allEntries) ? 
            <TouchableOpacity style={entryStyles.delete} onPress={() => {
                storage.save({
                    key: 'entries',
                    data: {
                        fields: allEntries.filter(elem => elem != data)
                    }
                }).then(response => {
                    setRerender(true);
                }).catch(err => {
                    Alert.alert('ERROR', 'Failed to delete entry. Please try again later.');
                });
            }}>
                <Feather name="x" size={30} color='red' />
            </TouchableOpacity> : null}
        </TouchableOpacity>
    );   
};

export default Entry;