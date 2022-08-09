import Feather from 'react-native-vector-icons/Feather';
import storage from '../utils/Storage';
import Dialog from 'react-native-dialog';
import axios from 'axios';
import React, { useState } from 'react';
import { url } from '../utils/Storage';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { entryStyles } from '../styles/EntryStyles';
import { useNetInfo } from '@react-native-community/netinfo';

Feather.loadFont();

const Entry = ({data, allEntries, onPress, setRerender}) => {
    const [share, setShare] = useState(false);
    const [target, setTarget] = useState('');
    const netInfo = useNetInfo();
    
    const onDelete = () => {
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
    }

    const onShare = () => {
        axios({
            method: 'patch',
            url: url + '/user/shares',
            data: {
                username: target,
                data
            }
        }).then(() => {
            Alert.alert('Success', `Sent the data entry to ${target}.`);
            setShare(false);
        }).catch(e => {
            Alert.alert('ERROR', e?.response?.data || e?.message);
            setShare(false);
        });
    }

    console.log(target);

    return (
        <TouchableOpacity style={entryStyles.container} onPress={onPress}>
            <View style={entryStyles.buttonContainer}>
                {netInfo?.isConnected && 
                <TouchableOpacity style={entryStyles.share} onPress={() => setShare(true)}>
                    <Feather name="share" size={25} color='blue' />
                </TouchableOpacity>}

                {allEntries && 
                <TouchableOpacity style={entryStyles.delete} onPress={() => {
                    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this data entry?', [
                        {
                            text: 'Cancel', 
                            onPress: () => {}
                        },
                        {
                            text: 'Confirm',
                            onPress: onDelete
                        }
                    ]);
                }}>
                    <Feather name="x" size={30} color='red' />
                </TouchableOpacity>}
            </View>
             
            <Dialog.Container visible={share}>
                <Dialog.Title>Share Entry</Dialog.Title>
                <Dialog.Description>
                    Enter the user's username who you want to share the data entry with. 
                </Dialog.Description>
                <Dialog.Input onChangeText={text => setTarget(text)} />
                <Dialog.Button label="Cancel" onPress={() => setShare(false)}/>
                <Dialog.Button label="Share" onPress={() => onShare(target)} />
            </Dialog.Container>

            <Text style={entryStyles.panelText}>{data.category} Entry</Text>
            <Text style={entryStyles.panelText}>{data.day}/{data.month}/{data.year} at {data.hours}:{data.mins}</Text>
        </TouchableOpacity>
    );   
};

export default Entry;